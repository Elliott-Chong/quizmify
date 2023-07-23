import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const MCQPage = async ({ params: { gameId } }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });
  if (!game || game.gameType === "open_ended") {
    return redirect("/quiz");
  }
  return <MCQ game={game} />;
};

export default MCQPage;
