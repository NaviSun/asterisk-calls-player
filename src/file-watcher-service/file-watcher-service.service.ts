import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as sane from "sane";
import { AudioFilesService } from "src/audiofiles/audiofiles.service";
import { CreateAduioFileDto } from "src/audiofiles/dto/create-audio.dto";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

@Injectable()
export class FileWatcherService implements OnModuleInit {
  private watcher: sane.Watcher;
  private readonly logger = new Logger(FileWatcherService.name);
  private processedFiles = new Set<string>();

  constructor(private readonly audioFileService: AudioFilesService) {}

  async onModuleInit() {
    // 1. Ручное сканирование существующих файлов
    await this.scanExistingFiles(process.env.WATCH_DIR);

    // 2. Инициализация вотчера для новых файлов
    this.initWatcher();
  }

  private async scanExistingFiles(dirPath: string | undefined) {
    if (typeof dirPath === "undefined") {
      this.logger.log(`Не верно указан путь`);
      return;
    }
    this.logger.log(`Starting initial scan of ${dirPath}`);

    try {
      const files = await this.getWavFilesRecursive(dirPath);
      this.logger.log(`Found ${files.length} existing WAV files`);

      for (const file of files) {
        await this.processFile(file);
        this.processedFiles.add(file);
      }
    } catch (err) {
      this.logger.error(`Initial scan error: ${err.message}`);
    }
  }

  private async getWavFilesRecursive(dir: string): Promise<string[]> {
    const files: string[] = await readdir(dir);
    const result: string[] = [];

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        if (file === "@Recycle") continue;
        const subFiles: string[] = await this.getWavFilesRecursive(fullPath);
        result.push(...subFiles);
      } else if (path.extname(file).toLowerCase() === ".wav") {
        result.push(fullPath);
      }
    }
    return result;
  }

  private initWatcher() {
    //Параметры конфигурации Наблюдателя
    this.watcher = sane(process.env.WATCH_DIR, {
      glob: ["**/*.wav"], // Отслеживаем только .wav файлы
      ignored: [
        "@Recycle/**",
        "**/@Recycle/**",
        "**/.*",
        ".*",
        "**/.streams/**",
        ".streams/**",
        ".*/**",
      ],
      poll: true,
      interval: 2000,
    });

    // Запуск наблюдателя
    this.watcher.on("ready", async () => {
      this.logger.log("Watcher is ready and started tracking files");
    });
    // Обработка события добавления файла
    this.watcher.on("add", async (filePath, root) => {
      console.log(filePath);
      if (this.processedFiles.has(filePath)) {
        return; // Уже обработали при начальном сканировании
      }
      await this.processFile(filePath);
    });

    // Обработка ошибок
    this.watcher.on("error", (error) => {
      this.logger.log(`Watcher error: ${error}`);
    });
  }

  private async processFile(filePath: string) {
    try {
      // Пропускаем файлы в @Recycle и .streams
      if (filePath.includes("@Recycle") || filePath.includes(".streams")) {
        return;
      }
      const fileName: string[] = filePath.split(path.sep);
      const exists = await this.audioFileService.exist(
        fileName[fileName.length - 1]
      );
      if (exists !== null) {
        this.logger.debug(`Файл уже есть в БД: ${filePath}`);
        return;
      }

      const fileInfo = this.prepareFileInfo(filePath);
      if (fileInfo) {
        await this.audioFileService.create(fileInfo);
        this.logger.log(`Файл успешно сохранен в БД: ${filePath}`);
      } else {
        this.logger.log(`Файл не сохранен ${filePath}`);
      }
    } catch (err) {
      this.logger.error(`Error processing ${filePath}: ${err.message}`);
    }
  }

  // Метод для оптимизации информации о файле
  prepareFileInfo(filePath: string): CreateAduioFileDto {
    const filePathArr: string[] = filePath.split(path.sep);
    const fileInfo: string[] = filePathArr[filePathArr.length - 1].split("_"); // Имя файла (например, 20250313-154949_9788810840_9890092525.wav)
    const filePathShortArr = filePathArr.slice(-4);
    const filePathShort = filePathShortArr.join("/");
    // Создаем объект с информацией о файле
    const fileInfoObj: CreateAduioFileDto = {
      filePath: filePathShort, // Путь к файлу
      inColNumber: fileInfo[1], // Входящий номер
      OutColNumber: fileInfo[2].slice(0, -4), // Исходящий номер (убираем .wav)
      fileName: filePathArr[filePathArr.length - 1], // Имя файла
      createdAt: this.parseDateTime(fileInfo[0]), // Дата и время создания
    };

    return fileInfoObj;
  }

  // Метод для преобразования строки даты в объект Date
  parseDateTime(dateTimeString: string): Date {
    const year = parseInt(dateTimeString.slice(0, 4), 10); // Год
    const month = parseInt(dateTimeString.slice(4, 6), 10) - 1; // Месяц (начинается с 0)
    const day = parseInt(dateTimeString.slice(6, 8), 10); // День
    const hours = parseInt(dateTimeString.slice(9, 11), 10); // Часы
    const minutes = parseInt(dateTimeString.slice(11, 13), 10); // Минуты
    const seconds = parseInt(dateTimeString.slice(13, 15), 10); // Секунды

    return new Date(year, month, day, hours, minutes, seconds);
  }
}
