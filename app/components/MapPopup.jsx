import Image from "next/image";
import React from "react";

function MapPopup() {
  return (
    <div className="flex w-[180px] flex-col  gap-4 rounded-xl bg-white">
      <Image
        src={"/assets/flowers.jpg"}
        width={196}
        height={100}
        className="w-full object-contain"
      />
      <div className="flex flex-col">
        <h2 className="text-start text-base font-medium capitalize text-textColor">
          valencia, spagna
        </h2>
        <span className="text-xs font-normal capitalize text-primaryGreen">
          Posto fantastico
        </span>
      </div>
      <div className="flex w-full items-center gap-2">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center gap-1">
            <Image
              src={"/assets/clock-3.svg"}
              width={15}
              height={15}
              className="object-contain"
            />
            <span className="text-xs font-normal capitalize text-textColor/50">
              validity
            </span>
          </div>
          <span className="ml-4 text-sm font-medium text-textColor">
            10 Aug
          </span>
        </div>
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center">
            <Image
              src={"/assets/navigation.svg"}
              width={15}
              height={15}
              className="object-contain"
            />
            <span className="text-xs font-normal capitalize text-textColor/50">
              Journey By
            </span>
          </div>
          <span className="ml-4 text-sm font-medium text-textColor">Plane</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#FF4F4F]/[0.05] px-3 py-2 text-xs capitalize text-[#FF4F4F]">
          <Image
            src={"/assets/trash.svg"}
            width={12}
            height={12}
            className="object-contain"
          />
          Delete
        </button>
        <button className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#7B7B7B]/[0.08] px-3 py-2 text-xs capitalize text-[#7B7B7B]">
          <Image
            src={"/assets/edit.svg"}
            width={12}
            height={12}
            className="object-contain"
          />
          Edit
        </button>
      </div>
    </div>
  );
}

export default MapPopup;
