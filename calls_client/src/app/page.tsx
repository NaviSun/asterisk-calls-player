import Image from "next/image";
import avatar from "../assets/avatars/avatar.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";



export default function Home() {
  return (
    <div className="items-center min-h-screen w-[1440px] font-[family-name:var(--font-geist-sans)] mx-auto">
      <header className="h-16 bg-white rounded-b-lg flex">
        <div className="flex items-center py-3 px-3.5">
          <div className="w-[60px] h-10 ">
            <Image
              className="rounded-full"
              src={avatar}
              width={40}
              height={40}
              alt="avatar"
            />
          </div>
          <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="cursor-pointer">
                    <b className="text-xl">Dominique Ch.</b>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink className="cursor-pointer">Link</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div>
          <div>search</div>
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
