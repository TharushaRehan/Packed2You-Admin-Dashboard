import Image from "next/image";
import React from "react";

interface Props {
  name: string;
  products: number;
  image?: any;
}

const CategoryComponent: React.FC<Props> = ({ name, products, image }) => {
  return (
    <div className="flex flex-col border-2 shadow-sm shadow-green-400 rounded-lg p-5 text-center space-y-5 items-center">
      <p className="text-lg font-bold">{name}</p>
      <Image src={image} alt={name} width={100} height={100} />
      <p className="text-base">
        <span className="text-xs">No. of Products - </span>
        {products}
      </p>
    </div>
  );
};

export default CategoryComponent;
