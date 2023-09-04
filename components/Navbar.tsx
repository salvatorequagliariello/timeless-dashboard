import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ModeToggle } from "@/components/theme-toggle";


const Navbar = async () => {
    const { userId } =  auth();
    if (!userId) redirect("/sign-in");

    const stores = await prismadb.store.findMany({
        where: {
            userId,
        },
    });

    return (
        <div className="border-b w-full">
            <div className="flex h-16 items-center lg:px-4 px-2 w-full">
                <StoreSwitcher items={stores} />
                <MainNav className="lg:mx-6 mx-2 w-full"/>
                <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle />
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    )
};

export default Navbar;