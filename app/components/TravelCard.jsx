import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function TravelCard({ data, fetchData }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(null);
  const onItemClick = (item) => {
    if (activeItem === item) {
      // If the clicked item is the active one, toggle it off
      setActiveItem(item);
    } else {
      // If a different item is clicked, set it as the active one
      setActiveItem(item);
      console.log("click on item: ", item);
    }
  };
  const deleteMemories = async (id) => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(`api/memory?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
        fetchData();
      }
    }
  };
  return (
    <>
      {data.map((item, index) => (
        <div
          key={index}
          onClick={() => onItemClick(item)}
          className={`relative flex  w-full  items-start gap-5 rounded-[10px] border  bg-white p-3  shadow-searchBox transition-all duration-300 after:absolute after:right-0 after:top-4  after:h-5 after:w-1 after:transform after:bg-primaryGreen after:transition-all after:duration-300 after:content-[''] hover:border-primaryGreen ${
            activeItem === item
              ? "border-primaryGreen after:block"
              : "border-white after:hidden"
          }`}
        >
          <div className="h-full w-36 rounded-[5px]">
            <img
              src="/assets/flowers.jpg"
              alt="images"
              className="h-full max-w-full rounded-[5px] object-cover"
            />
            {/* <Image src={"/assets/flowers.jpg"} width={210} height={140} /> */}
          </div>

          <div className="flex flex-1 flex-col items-start gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium capitalize text-textColor">
                {item.address}
              </h2>
              <p className="text-[13px] font-normal text-textColor/60">
                {item.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-[5px] bg-[#f4f4f4] px-2 py-[6px]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_6_159)">
                    <path
                      d="M6.99996 12.8333C10.2216 12.8333 12.8333 10.2217 12.8333 7C12.8333 3.77834 10.2216 1.16667 6.99996 1.16667C3.7783 1.16667 1.16663 3.77834 1.16663 7C1.16663 10.2217 3.7783 12.8333 6.99996 12.8333Z"
                      stroke="#7B7B7B"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 3.5V7H9.625"
                      stroke="#7B7B7B"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_159">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-[12px] capitalize text-[#7b7b7b]">
                  Validity: {item.eDate}
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-[5px] bg-[#f4f4f4] px-2 py-[6px]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.75 6.41667L12.8333 1.16667L7.58333 12.25L6.41667 7.58333L1.75 6.41667Z"
                    stroke="#7B7B7B"
                    stroke-width="1.21333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="text-[12px] capitalize text-[#7b7b7b]">
                  Journey By: {item.mod}
                </span>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 7.5C15 12 9 16.5 9 16.5C9 16.5 3 12 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z"
                    fill="#459F48"
                  />
                  <path
                    d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z"
                    fill="white"
                  />
                </svg>
                <h3 className="text-sm font-medium capitalize text-primaryGreen">
                  {item.address}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 transition-colors duration-300 group-hover:stroke-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  className="group"
                  onClick={() => deleteMemories(item._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 transition-colors duration-300 group-hover:stroke-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default TravelCard;
