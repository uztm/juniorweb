import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LessonCard from "./lessonCard";

export function TabsDemo() {
  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Oylik</TabsTrigger>
          <TabsTrigger value="password">Haftalik</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className=" grid grid-cols-1 md:grid-cols-2 w-full gap-2 ">
          {[...Array(10)].map((_, index) => (
            <LessonCard key={`monthly-${index}`} />
          ))}
        </TabsContent>
        <TabsContent value="password" className=" grid grid-cols-1 md:grid-cols-2 w-full gap-2 ">
          {[...Array(10)].map((_, index) => (
            <LessonCard key={`monthly-${index}`} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
