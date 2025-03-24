import { Injectable, OnModuleInit } from "@nestjs/common";
import * as sane from "sane";
import { AudioFilesService } from "src/audiofiles/audiofiles.service";
import { CreateAduioFileDto } from "src/audiofiles/dto/create-audio.dto";
import * as path from "path";

@Injectable()
export class FileWatcherService implements OnModuleInit {
  private watcher: sane.Watcher;

  constructor(private readonly audioFileService: AudioFilesService) {}

  onModuleInit() {
    // Инициализация наблюдателя
    this.watcher = sane(process.env.WATCH_DIR, {
      glob: ["**/*.wav"], // Отслеживаем только .wav файлы
      watchman: false,
      poll: true,
      interval: 1000, // Отключаем Watchman (если не используется)
    });
    // Запуск наблюдателя
    this.watcher.on("ready", async () => {
      console.log("Watcher is ready and started tracking files");
    });

    // Обработка события добавления файла
    this.watcher.on("add", async (filePath, root) => {
      console.log(`File ${root + "/" +':::' + filePath} has been added`);

      // Проверяем, существует ли файл в базе данных
      const fileName = filePath.split(path.sep);
      const existFile = await this.audioFileService.exist(fileName[3]);
      console.log(existFile, "Exist File");
      if (existFile === null) {
        console.log('Файл не существет, сохраняем в базу');
        // Оптимизация информации о файле
        const fileInfo = this.fileOptimize(filePath);

        // Сохраняем файл в базу данных
        await this.audioFileService.create(fileInfo);
        console.log(`File ${filePath} has been saved to the database`);
      }
    });

    // Обработка ошибок
    this.watcher.on("error", (error) => {
      console.error(`Watcher error: ${error}`);
    });
  }

  // Метод для оптимизации информации о файле
  fileOptimize(filePath: string): CreateAduioFileDto {
    const filePathArr = filePath.split(path.sep);
    const fileInfo = filePathArr[3].split("_"); // Имя файла (например, 20250313-154949_9788810840_9890092525.wav)
    console.log(fileInfo, ':::: FileInfo');

    // Создаем объект с информацией о файле
    const fileInfoObj: CreateAduioFileDto = {
      filePath: filePath, // Путь к файлу
      inColNumber: fileInfo[1], // Входящий номер
      OutColNumber: fileInfo[2].slice(0, -4), // Исходящий номер (убираем .wav)
      fileName: filePathArr[3], // Имя файла
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
