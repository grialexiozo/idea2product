"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StyleCardProps {
  id: string;
  name: string;
  description: string;
  prompt: string;
  previewImage: string;
}

export function StyleCard({ id, name, description, prompt, previewImage }: StyleCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the image generation page with the style parameters
    router.push(`/image?style=${encodeURIComponent(id)}&prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={previewImage}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          onClick={handleClick}
          className="w-full"
        >
          Generate Image
        </Button>
      </CardFooter>
    </Card>
  );
} 