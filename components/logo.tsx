import Image from "next/image"

export function Logo() {
  return (
    <div className="w-16 h-16">
      <Image
        // src="https://i.postimg.cc/pTPGkFFP/Coral-Life-W-0.png"
        src="https://i.postimg.cc/pTk0SLfz/batch-INDEX-LIVING-MALL.webp"
        alt="Index Living Mall"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}

