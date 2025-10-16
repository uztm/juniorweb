'use client';
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Award, Star, Trophy, Medal, TrendingUp, Quote } from "lucide-react";

interface HeroUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Hero {
  id: number;
  month: number;
  month_name: string;
  user: HeroUser;
  type: "teacher" | "student";
  image: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export default function HeroOfMonthPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroes = async () => {
    try {
      const res = await fetch("https://api.pdpjunior.uz/api/heroes/");
      const json = await res.json();
      const data: Hero[] = json.results || [];

      const sorted = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const latestMonth = sorted.length > 0 ? sorted[0].month_name : null;
      const latestHeroes = sorted.filter((h) => h.month_name === latestMonth);

      const teacher = latestHeroes.find((h) => h.type === "teacher");
      const student = latestHeroes.find((h) => h.type === "student");

      const finalHeroes = [teacher, student].filter(Boolean) as Hero[];
      setHeroes(finalHeroes);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching heroes:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-700 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="float-icon-1">
          <Star className="w-6 h-6 text-blue-600 opacity-30" />
        </div>
        <div className="float-icon-2">
          <Trophy className="w-8 h-8 text-indigo-600 opacity-25" />
        </div>
        <div className="float-icon-3">
          <Medal className="w-7 h-7 text-blue-500 opacity-30" />
        </div>
        <div className="float-icon-4">
          <Star className="w-5 h-5 text-purple-600 opacity-25" />
        </div>
        <div className="float-icon-5">
          <Award className="w-6 h-6 text-indigo-500 opacity-30" />
        </div>
        <div className="float-icon-6">
          <TrendingUp className="w-6 h-6 text-blue-600 opacity-25" />
        </div>
        <div className="float-icon-7">
          <Trophy className="w-5 h-5 text-blue-500 opacity-30" />
        </div>
        <div className="float-icon-8">
          <Medal className="w-6 h-6 text-indigo-600 opacity-25" />
        </div>
      </div>

      <div className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          {/* <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg transform transition-transform hover:scale-105">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div> */}
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 tracking-tight">
            Oyning Qahramonlari
          </h1>
          
          {heroes.length > 0 && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-blue-100 mb-4 transition-all hover:shadow-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-slate-700 font-semibold">
                {formatDate(heroes[0].month_name)}
              </span>
            </div>
          )}
          
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            O'z yutuqlari bilan bizni ilhomlantirgan oy qahramonlarini tabriklaymiz.
          </p>

          {/* Stats bar */}
          {heroes.length > 0 && (
            <div className="mt-8 flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{heroes.length}</div>
                <div className="text-sm text-slate-600">Qahramonlar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">100%</div>
                <div className="text-sm text-slate-600">Mukammallik</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">★★★★★</div>
                <div className="text-sm text-slate-600">Yutuqlar</div>
              </div>
            </div>
          )}
        </div>

        {/* Heroes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {heroes.map((hero, index) => (
            <div
              key={hero.id}
              className="group"
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
              }}
            >
              <Card className="relative bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '2px', zIndex: -1 }}></div>
                <div className="absolute inset-0.5 rounded-3xl bg-white"></div>
                
                {/* Top accent */}
                {/* <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-3xl"></div> */}
                
                {/* Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    hero.type === "teacher" 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700" 
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700"
                  }`}>
                    <Award className="w-4 h-4" />
                    <span className="uppercase tracking-wider">
                      {hero.type === "teacher" ? "O'qituvchi" : "O'quvchi"}
                    </span>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-6 left-6 opacity-10">
                  <Star className="w-12 h-12 text-blue-600 fill-blue-600" />
                </div>

                <CardHeader className="flex flex-col items-center text-center pt-16 pb-6 px-8">
                  {/* Avatar with ring animation */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full opacity-20 animate-ping-slow"></div>
                    <Avatar className="relative w-32 h-32 sm:w-36 sm:h-36 ring-4 ring-white shadow-2xl transition-all duration-500 group-hover:ring-8 group-hover:ring-blue-100">
                      <AvatarImage src={hero.image} alt={hero.user.username} className="object-cover" />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                        {hero.user.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {/* Achievement badge on avatar */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform transition-transform group-hover:scale-110">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <CardTitle className="text-2xl z-40 sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                    {hero.user.first_name} {hero.user.last_name}
                  </CardTitle>
                  
                  
                  <CardDescription className="text-sm font-semibold z-40 text-slate-600 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                    <Medal className="w-4 h-4 text-blue-600" />
                    <span>{hero.type === "teacher" ? "Oyning O'qituvchisi" : "Oyning O'quvchisi"}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  {/* Description card */}
                  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-inner">
                    {/* Quote decoration */}
                    <div className="absolute -top-3 left-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md transform -rotate-6">
                        <span className="text-white text-2xl font-serif">
                          <Quote/>
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 text-center leading-relaxed text-sm sm:text-base pt-3 font-medium">
                      {hero.description || "Ta'lim va rivojlanishga ajoyib hissa qo'shdi"}
                    </p>
                    
                    {/* Star rating visual */}
                    <div className="flex justify-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {heroes.length === 0 && !loading && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg">
              <Award className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Oyning qahramonlari tez orada e'lon qilinadi
            </h3>
            <p className="text-slate-600 text-lg">Kuting, ajoyib natijalar yo'lda</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes floatDiagonal {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -15px) rotate(90deg);
          }
          50% {
            transform: translate(0, -30px) rotate(180deg);
          }
          75% {
            transform: translate(-15px, -15px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        @keyframes floatHorizontal {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(30px) rotate(180deg);
          }
        }

        @keyframes floatCircular {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -10px) rotate(90deg);
          }
          50% {
            transform: translate(0, -20px) rotate(180deg);
          }
          75% {
            transform: translate(-20px, -10px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        @keyframes pingSlow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Floating icon animations */
        .float-icon-1 {
          position: absolute;
          top: 15%;
          left: 10%;
          animation: floatDiagonal 12s ease-in-out infinite;
        }

        .float-icon-2 {
          position: absolute;
          top: 25%;
          right: 15%;
          animation: floatCircular 15s ease-in-out infinite;
          animation-delay: 1s;
        }

        .float-icon-3 {
          position: absolute;
          bottom: 30%;
          left: 8%;
          animation: float 10s ease-in-out infinite;
          animation-delay: 2s;
        }

        .float-icon-4 {
          position: absolute;
          top: 60%;
          right: 12%;
          animation: floatHorizontal 8s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .float-icon-5 {
          position: absolute;
          top: 45%;
          left: 15%;
          animation: floatCircular 13s ease-in-out infinite;
          animation-delay: 3s;
        }

        .float-icon-6 {
          position: absolute;
          bottom: 20%;
          right: 20%;
          animation: floatDiagonal 11s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .float-icon-7 {
          position: absolute;
          top: 35%;
          left: 50%;
          animation: float 9s ease-in-out infinite;
          animation-delay: 2.5s;
        }

        .float-icon-8 {
          position: absolute;
          bottom: 40%;
          right: 8%;
          animation: floatHorizontal 14s ease-in-out infinite;
          animation-delay: 4s;
        }

        @media (max-width: 1024px) {
          .float-icon-1, .float-icon-5, .float-icon-7 { display: none; }
        }

        @media (max-width: 640px) {
          .float-icon-2, .float-icon-6 { display: none; }
        }

        .animate-ping-slow {
          animation: pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}