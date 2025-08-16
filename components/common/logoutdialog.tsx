import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, LogOut, XCircle } from "lucide-react";
import { useState } from "react";

type props = {
  width?: string;
  isCollapsed?: boolean;
};

export function LogOutDialog({ width, isCollapsed }: props) {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    // Тут нужно вставить логику выхода из системы, например:
    // api.logout().then(() => redirect('/login'))
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/auth"; // Перенаправление на страницу входа
    }, 1500);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            className={`group gap-2 ${
              width ? width : "w-full"
            } h-[50px] bg-red-400/20 cursor-pointer rounded-2xl border-2 border-red-500/20 absolute bottom-25 hover:bg-red-500 text-white px-3`}
          >
            <LogOut className="w-6 text-red-500 group-hover:text-white" />
            {isCollapsed ? null : (
              <p className="font-bold text-sm text-red-500 group-hover:text-white">
                Tizimdan chiqish
              </p>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[400px] rounded-xl">
          <DialogHeader className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-500 w-8 h-8" />
            <DialogTitle className="text-lg font-semibold">
              Chiqishni tasdiqlang
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className=" text-gray-700 text-center">
            Siz rostdan ham tizimdan chiqmoqchimisiz? Bu amalni qaytarib
            bo‘lmaydi.
          </DialogDescription>

          <DialogFooter className="flex justify-end w-full">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 md:w-1/2 "
                disabled={loading}
              >
                <XCircle className="w-5 h-5" />
                Bekor qilish
              </Button>
            </DialogClose>
            <Button
              className="md:w-1/2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
              disabled={loading}
              type="button"
            >
              <LogOut className="w-5 h-5" />
              {loading ? "Chiqish..." : "Ha, chiqish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
