import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import Map from "./Map";
import TravelCard from "./TravelCard";
import { usePathname, useRouter } from "next/navigation";
import L from "leaflet";
import MarkerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MapPopup from "./MapPopup";
import Sheet from "react-modal-sheet";
import { data } from "autoprefixer";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MapPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [allMemories, setAllMemories] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [country, setCountry] = useState(0);
  const [city, setCity] = useState(0);
  const router = useRouter();
  const pathName = usePathname();
  const [latitude, setLatitude] = useState("23.73283");
  const [longitude, setLongitude] = useState("90.398619");
  const { data: session } = useSession();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [sourceQuery, setsourceQuery] = useState("");
  const [QueryChange, setQueryChange] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  if (session?.user) {
    console.log("map session:", session?.user?.id);
  }
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };
  const handleEditForm = async (item) => {
    setEditItem(item);
    setIsEditFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };
  const handleOnclick = () => {
    try {
      signOut();
    } catch (error) {
      toast.success("Something went wrong!");
    } finally {
      toast.success("Successfully Logged Out!");
    }
  };

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
        getMemories();
      }
    }
  };
  //  all memories

  const getMemories = async () => {
    try {
      const res = await fetch(`api/memory?userId=${session?.user.id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch topics");
      }

      const data = await res.json();
      console.log("all memroies:", data.memories);
      console.log("all country:", data.CountryCount);
      console.log("all city:", data.cityCount);
      setAllMemories(data.memories);
      setCountry(data.CountryCount);
      setCity(data.cityCount);
    } catch (error) {
      console.log("Error loading topics: ", error);
    }
  };
  // useEffect(() => {
  //   getMemories();
  // }, [session?.user.id]);
  // search memory
  useEffect(() => {
    const delayDebouncefn = setTimeout(() => {
      if (
        session?.user?.id !== null &&
        session?.user?.id !== undefined &&
        sourceQuery !== ""
      ) {
        getSearchMemory();
      } else {
        getMemories();
      }
    }, 1000);
    return () => clearTimeout(delayDebouncefn);
  }, [sourceQuery, session?.user?.id]);

  const getSearchMemory = async () => {
    try {
      const res = await fetch(
        `api/search-memory?userId=${session?.user.id}&q=${sourceQuery}`,
        {
          cache: "no-store",
        },
      );
      const searchResult = await res.json();
      console.log("search result: ", searchResult);
      setAllMemories(searchResult.memories);
    } catch (error) {
      console.log(error);
    }
  };
  // const handleSearch = (e) => {
  //   setsourceQuery(e.target.value);
  //   getSearchMemory();
  // };
  const onClickItem = (item) => {
    setActiveItem(item);
    setSheetOpen(true);
  };
  return (
    <div className="relative h-full w-full">
      {/* Mobile version */}
      <div className="relative mx-auto h-screen w-full  bg-white p-5 md:hidden">
        <div className="absolute z-[60] flex flex-col gap-2">
          <div className="flex w-full items-center gap-2">
            <div className=" relative flex-1  rounded-[10px] bg-white py-[11px] shadow-searchBox">
              <Image
                src={"/assets/search.svg"}
                width={22}
                height={22}
                className="absolute  left-3  top-1/2 flex-1 -translate-y-1/2 transform"
              />
              <input
                onChange={(e) => {
                  setsourceQuery(e.target.value);
                }}
                value={sourceQuery}
                type="text"
                className="h-full w-full pl-11 pr-4 outline-none placeholder:text-sm placeholder:capitalize placeholder:text-[#999999]"
                placeholder="Search..."
              />
            </div>
            <button
              onClick={getSearchMemory}
              className="flex items-center  justify-center rounded-[10px] bg-white p-3 shadow-searchBox"
            >
              <Image src={"/assets/info.svg"} width={22} height={22} />
            </button>
          </div>
          <div className="w-fit rounded-lg bg-white p-3 shadow-searchBox">
            {/* <p className="text-xs font-medium capitalize text-[#121212]">
              No Memory
            </p> */}
            {allMemories.length === 0 ? (
              <span className="text-xs font-medium capitalize text-textColor">
                No Memory
              </span>
            ) : (
              <div className=" flex w-[179px] items-center justify-center rounded-md   text-xs font-medium capitalize">
                <div className="flex items-center gap-1">
                  <Image src={"/assets/flag-fill.svg"} width={14} height={14} />
                  <span className="text-xs font-medium capitalize">
                    {country} Countries
                  </span>
                </div>
                <span className="mx-auto h-full w-[1px] bg-black/[0.01]"></span>
                <div className="flex items-center gap-1">
                  <Image src={"/assets/map-pin.svg"} width={14} height={14} />
                  <span className="text-xs font-medium capitalize">
                    {city} Cities
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute left-0 top-0 z-[48] h-full min-h-screen w-full">
          {/* {<Map />} */}
          <MapContainer
            style={{ width: "100%", height: "100%", zIndex: "49" }}
            center={[latitude, longitude]}
            zoom={1.5}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {allMemories?.map((item, index) => (
              <Marker
                key={index}
                position={[item.latitude, item.longitude]}
                icon={
                  new L.Icon({
                    iconUrl: "/assets/map-pin.svg",
                    iconSize: [48, 60],
                    iconAnchor: [12.5, 41],
                    popupAnchor: [0, -41],
                    shadowUrl: MarkerShadow.src,
                    shadowSize: [41, 41],
                  })
                }
              >
                <Popup closeButton={false}>
                  <div className="flex w-[180px] flex-col  gap-4 rounded-xl bg-white">
                    <Image
                      src={"/assets/flowers.jpg"}
                      width={196}
                      height={100}
                      className="w-full object-contain"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-start text-base font-medium capitalize text-textColor">
                        {item.full_address}
                      </h2>
                      <span className="text-xs font-normal capitalize text-primaryGreen">
                        {item.address}
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
                          {item.eDate}
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
                        <span className="ml-4 text-sm font-medium text-textColor">
                          {item.mod}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteMemories(item._id)}
                        className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#FF4F4F]/[0.05] px-3 py-2 text-xs capitalize text-[#FF4F4F]"
                      >
                        <Image
                          src={"/assets/trash.svg"}
                          width={12}
                          height={12}
                          className="object-contain"
                        />
                        Delete
                      </button>
                      <button
                        onClick={() => handleEditForm(item)}
                        className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#7B7B7B]/[0.08] px-3 py-2 text-xs capitalize text-[#7B7B7B]"
                      >
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
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="fixed bottom-0 left-1/2 z-[65] w-full -translate-x-1/2 transform">
          <div className="flex w-full flex-col items-center gap-2">
            <Carousel
              showArrows={true}
              showIndicators={false}
              showThumbs={false}
              showStatus={false}
              infiniteLoop={false}
              centerMode={true}
              centerSlidePercentage={70}
              swipeable={false}
              emulateTouch={true}
              swipeScrollTolerance={allMemories.length}
              transitionTime={500}
              className="w-full whitespace-nowrap p-2"
            >
              {allMemories.map((item, index) => (
                <div
                  onClick={() => onClickItem(item)}
                  key={index}
                  className="flex h-16 w-60  items-center gap-3  overflow-hidden rounded-xl bg-white p-2"
                >
                  <div className="h-[52px]w-[52px] rounded-md">
                    <Image
                      src={item.imgUrl}
                      width={52}
                      height={52}
                      blurDataURL="data..."
                      placeholder="blur"
                      alt="list image"
                      className="rounded-md object-cover"
                    />
                  </div>

                  <div className="flex w-44 flex-col items-start justify-start overflow-hidden">
                    <h2 className="text-base font-medium capitalize text-textColor">
                      {item.full_address}
                    </h2>
                    <p className="text-xs font-normal capitalize text-primaryGreen">
                      {item.address}
                    </p>
                  </div>
                </div>
              ))}
            </Carousel>

            <div className="flex w-full items-center justify-center gap-4 pb-10">
              <div className="flex h-[60px] w-[220px] items-center justify-between rounded-[18px] bg-black px-5 text-white">
                <button
                  className={`transition-all duration-300 hover:opacity-60 ${
                    pathName === "/dashboard" ? "opacity-70" : "opacity-100"
                  }`}
                >
                  <Image src={"/assets/map.svg"} width={24} height={24} />
                </button>
                <button
                  className={`${
                    pathName === "list" ? "opacity-70" : "opacity-100"
                  } transition-all duration-300 hover:opacity-60`}
                >
                  <Image
                    src={"/assets/layout-list.svg"}
                    width={24}
                    height={24}
                  />
                </button>
                <button
                  onClick={() => setshowProfile(!showProfile)}
                  className={`${
                    pathName === "profile" ? "opacity-70" : "opacity-100"
                  } relative transition-all duration-300 hover:opacity-60`}
                >
                  <Image src={"/assets/user-2.svg"} width={24} height={24} />
                  <div
                    className={`absolute left-0 ${
                      showProfile ? "visible" : "invisible"
                    } bottom-full z-[22222] w-60 rounded-lg border border-primaryGreen bg-primaryGreen px-5 py-3 shadow`}
                  >
                    <ul class="space-y-3 ">
                      <li className="font-medium">
                        <a
                          href="#"
                          className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-primaryGreen"
                        >
                          <div class="mr-3">
                            <svg
                              class="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                          </div>
                          Account
                        </a>
                      </li>
                      <li className="font-medium">
                        <a
                          href="#"
                          className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-primaryGreen"
                        >
                          <div className="mr-3">
                            <svg
                              class="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              ></path>
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                            </svg>
                          </div>
                          Setting
                        </a>
                      </li>
                      <hr className="dark:border-gray-700" />
                      <li className="font-medium">
                        <button
                          onClick={handleOnclick}
                          className="flex w-full transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-red-600"
                        >
                          <div className="mr-3 text-red-600">
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              ></path>
                            </svg>
                          </div>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </button>
              </div>
              <div className="flex  items-center justify-center rounded-[18px] bg-[#459F48] p-4">
                <button onClick={handleOpenForm} className="hover:opacity-60">
                  <Image src={"/assets/plus.svg"} width={28} height={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Sheet
          isOpen={isSheetOpen}
          onClose={() => setSheetOpen(false)}
          onSnap={(snapIndex) =>
            console.log("> Current snap point index:", snapIndex)
          }
          detent="content-height"
        >
          <Sheet.Container>
            <Sheet.Content>
              <div
                style={{ height: 430, width: 390 }}
                className="flex  w-full flex-col items-start  gap-4 rounded-xl bg-white p-4"
              >
                <Image
                  src={activeItem?.imgUrl}
                  width={350}
                  height={190}
                  className="w-full object-cover"
                />
                <div className="flex flex-col">
                  <h2 className="text-start text-base font-medium capitalize text-textColor">
                    {activeItem?.full_address}
                  </h2>
                  <span className="text-xs font-normal capitalize text-primaryGreen">
                    {activeItem?.address}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex w-full flex-col">
                    <div className="flex w-full items-center gap-1 px-4 py-3">
                      <Image
                        src={"/assets/clock-3.svg"}
                        width={15}
                        height={15}
                        className="object-contain"
                      />
                      <span className="text-xs font-normal capitalize text-textColor/50">
                        validity
                      </span>
                      <span className="ml-4 text-sm font-medium text-textColor">
                        10 Aug
                      </span>
                    </div>
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
                    <span className="ml-4 text-sm font-medium text-textColor">
                      Plane
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pb-3">
                  <button
                    onClick={() => deleteMemories(item._id)}
                    className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#FF4F4F]/[0.05] px-3 py-2 text-xs capitalize text-[#FF4F4F]"
                  >
                    <Image
                      src={"/assets/trash.svg"}
                      width={12}
                      height={12}
                      className="object-contain"
                    />
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditForm(item)}
                    className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#7B7B7B]/[0.08] px-3 py-2 text-xs capitalize text-[#7B7B7B]"
                  >
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
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </div>
      {/* end Mobile version */}

      {/* desktop version */}
      <div className=" hidden h-screen max-w-[1440px] justify-start md:flex">
        <div className="flex w-1/2">
          <div className="flex w-[80px] flex-col items-center justify-between bg-sideNavbg p-5">
            <div className="flex flex-col items-center gap-24">
              <button>
                <Image
                  src={"/assets/logo.png"}
                  width={44}
                  height={44}
                  className="rounded-full border object-contain"
                />
              </button>
              <div className="flex flex-col items-center gap-7">
                <button className=" group relative">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    xmlns="http://www.w3.org/2000/svg"
                    className={` group-hover:stroke-primaryGreen ${
                      pathName === "/dashboard"
                        ? "stroke-primaryGreen"
                        : "stroke-[#7C85AB]"
                    }`}
                  >
                    <g id="map">
                      <path
                        id="Vector"
                        d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        id="Vector_2"
                        d="M9 3V18"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        id="Vector_3"
                        d="M15 6V21"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                  <svg
                    width="6"
                    height="6"
                    viewBox="0 0 6 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`absolute left-1/2 top-8  -translate-x-1/2 transform group-hover:block ${
                      pathName === "/dashboard" ? "block" : "hidden"
                    }`}
                  >
                    <circle cx="3" cy="3" r="3" fill="#459F48" />
                  </svg>
                  {/* <Image
                    src={"/assets/map.png"}
                    width={26}
                    height={26}
                    className=" object-contain"
                  /> */}
                </button>
                <button className="group relative">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-[#7C85AB] group-hover:stroke-primaryGreen"
                    stroke-width="1.8"
                  >
                    <g id="settings">
                      <path
                        id="Vector"
                        d="M13.2383 2.16667H12.7617C12.187 2.16667 11.6359 2.39494 11.2296 2.80127C10.8233 3.2076 10.595 3.7587 10.595 4.33334V4.52834C10.5946 4.90829 10.4943 5.28146 10.3042 5.61041C10.114 5.93936 9.84072 6.21253 9.51167 6.40251L9.04584 6.67334C8.71646 6.8635 8.34283 6.96362 7.9625 6.96362C7.58217 6.96362 7.20854 6.8635 6.87917 6.67334L6.71667 6.58667C6.21949 6.29987 5.62883 6.22207 5.07434 6.37034C4.51985 6.51861 4.04685 6.88084 3.75917 7.37751L3.52084 7.78917C3.23404 8.28635 3.15623 8.87702 3.3045 9.4315C3.45277 9.98599 3.815 10.459 4.31167 10.7467L4.47417 10.855C4.80163 11.0441 5.07392 11.3155 5.26397 11.6424C5.45402 11.9693 5.55522 12.3402 5.5575 12.7183V13.2708C5.55902 13.6526 5.45962 14.028 5.26938 14.3591C5.07914 14.6901 4.80481 14.9649 4.47417 15.1558L4.31167 15.2533C3.815 15.541 3.45277 16.014 3.3045 16.5685C3.15623 17.123 3.23404 17.7137 3.52084 18.2108L3.75917 18.6225C4.04685 19.1192 4.51985 19.4814 5.07434 19.6297C5.62883 19.7779 6.21949 19.7001 6.71667 19.4133L6.87917 19.3267C7.20854 19.1365 7.58217 19.0364 7.9625 19.0364C8.34283 19.0364 8.71646 19.1365 9.04584 19.3267L9.51167 19.5975C9.84072 19.7875 10.114 20.0606 10.3042 20.3896C10.4943 20.7186 10.5946 21.0917 10.595 21.4717V21.6667C10.595 22.2413 10.8233 22.7924 11.2296 23.1987C11.6359 23.6051 12.187 23.8333 12.7617 23.8333H13.2383C13.813 23.8333 14.3641 23.6051 14.7704 23.1987C15.1767 22.7924 15.405 22.2413 15.405 21.6667V21.4717C15.4054 21.0917 15.5057 20.7186 15.6958 20.3896C15.886 20.0606 16.1593 19.7875 16.4883 19.5975L16.9542 19.3267C17.2835 19.1365 17.6572 19.0364 18.0375 19.0364C18.4178 19.0364 18.7915 19.1365 19.1208 19.3267L19.2833 19.4133C19.7805 19.7001 20.3712 19.7779 20.9257 19.6297C21.4802 19.4814 21.9532 19.1192 22.2408 18.6225L22.4792 18.2C22.766 17.7028 22.8438 17.1122 22.6955 16.5577C22.5472 16.0032 22.185 15.5302 21.6883 15.2425L21.5258 15.1558C21.1952 14.9649 20.9209 14.6901 20.7306 14.3591C20.5404 14.028 20.441 13.6526 20.4425 13.2708V12.7292C20.441 12.3474 20.5404 11.972 20.7306 11.641C20.9209 11.3099 21.1952 11.0351 21.5258 10.8442L21.6883 10.7467C22.185 10.459 22.5472 9.98599 22.6955 9.4315C22.8438 8.87702 22.766 8.28635 22.4792 7.78917L22.2408 7.37751C21.9532 6.88084 21.4802 6.51861 20.9257 6.37034C20.3712 6.22207 19.7805 6.29987 19.2833 6.58667L19.1208 6.67334C18.7915 6.8635 18.4178 6.96362 18.0375 6.96362C17.6572 6.96362 17.2835 6.8635 16.9542 6.67334L16.4883 6.40251C16.1593 6.21253 15.886 5.93936 15.6958 5.61041C15.5057 5.28146 15.4054 4.90829 15.405 4.52834V4.33334C15.405 3.7587 15.1767 3.2076 14.7704 2.80127C14.3641 2.39494 13.813 2.16667 13.2383 2.16667Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        id="Vector_2"
                        d="M13 16.25C14.7949 16.25 16.25 14.7949 16.25 13C16.25 11.2051 14.7949 9.75 13 9.75C11.2051 9.75 9.75 11.2051 9.75 13C9.75 14.7949 11.2051 16.25 13 16.25Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>

                  {/* <Image
                    src={"/assets/settings.png"}
                    width={26}
                    height={26}
                    className="object-contain"
                  /> */}

                  <div
                    className={`invisible absolute left-[52px] top-0 z-[22222] w-60 rounded-lg border bg-white px-5 py-3 shadow`}
                  >
                    <ul class="space-y-3 ">
                      <li className="font-medium">
                        <a
                          href="#"
                          className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-primaryGreen"
                        >
                          <div class="mr-3">
                            <svg
                              class="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                          </div>
                          Account
                        </a>
                      </li>
                      <li className="font-medium">
                        <a
                          href="#"
                          className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-primaryGreen"
                        >
                          <div className="mr-3">
                            <svg
                              class="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              ></path>
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                            </svg>
                          </div>
                          Setting
                        </a>
                      </li>
                      <hr className="dark:border-gray-700" />
                      <li className="font-medium">
                        <a
                          href="#"
                          className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-red-600"
                        >
                          <div className="mr-3 text-red-600">
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              ></path>
                            </svg>
                          </div>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <button
                onClick={() => setshowProfile(!showProfile)}
                className="group relative rounded-full border border-[#7C85AB]"
              >
                {session?.user ? (
                  <Image
                    src={session.user.image}
                    width={24}
                    height={24}
                    alt="profile pic"
                    className="rounded-full object-contain"
                  />
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke-width="1.5"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-[#7C85AB] group-hover:stroke-primaryGreen"
                  >
                    <g id="user-2">
                      <path
                        id="Vector"
                        d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        id="Vector_2"
                        d="M20 21C20 18.8783 19.1571 16.8434 17.6569 15.3431C16.1566 13.8429 14.1217 13 12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                )}

                {/* <Image
                  src={"/assets/logo.png"}
                  width={40}
                  height={40}
                  className="rounded-full border object-contain"
                /> */}
                <div
                  className={`absolute left-[52px] ${
                    showProfile ? "visible" : "invisible"
                  } bottom-0 z-[22222] w-60 rounded-lg border bg-white px-5 py-3 shadow`}
                >
                  <ul class="space-y-3 ">
                    <li className="font-medium">
                      <a
                        href="#"
                        className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-primaryGreen"
                      >
                        <div class="mr-3">
                          <svg
                            class="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                        </div>
                        Account
                      </a>
                    </li>
                    <li className="font-medium">
                      <a
                        href="#"
                        className="flex transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-primaryGreen"
                      >
                        <div className="mr-3">
                          <svg
                            class="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            ></path>
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                        </div>
                        Setting
                      </a>
                    </li>
                    <hr className="dark:border-gray-700" />
                    <li className="font-medium">
                      <button
                        onClick={handleOnclick}
                        className="flex w-full transform items-center border-r-4 border-transparent transition-colors duration-200 hover:border-red-600"
                      >
                        <div className="mr-3 text-red-600">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            ></path>
                          </svg>
                        </div>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </button>
              <button className="group" onClick={handleOnclick}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className=" stroke-[#7C85AB] group-hover:stroke-primaryGreen"
                  stroke-width="1.8"
                >
                  <g id="log-out">
                    <path
                      id="Vector"
                      d="M9.75 22.75H5.41667C4.84203 22.75 4.29093 22.5217 3.8846 22.1154C3.47827 21.7091 3.25 21.158 3.25 20.5833V5.41667C3.25 4.84203 3.47827 4.29093 3.8846 3.8846C4.29093 3.47827 4.84203 3.25 5.41667 3.25H9.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="Vector_2"
                      d="M17.3334 18.4166L22.75 13L17.3334 7.58331"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="Vector_3"
                      d="M22.75 13H9.75"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex w-full  flex-col gap-4 border bg-white p-5 shadow-listContentShadow">
            <div className="flex items-center justify-between ">
              <div className="w-3/5 flex-col justify-start">
                <h2 className="text-[21px] font-bold capitalize text-textColor">
                  Hey, traveller!
                </h2>
                <p className="text-sm font-normal text-[#999999]">
                  Welcome to your very personal memory map.
                </p>
              </div>
              <button
                onClick={handleOpenForm}
                className="flex w-2/5 items-center justify-center gap-2 rounded-lg bg-primaryGreen px-4 py-3 text-base font-bold capitalize text-white"
              >
                <Image
                  src={"/assets/plus.svg"}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="hidden lg:block">Add New Memory</span>
              </button>
            </div>
            <div className=" relative h-11 w-full rounded-lg bg-textColor/[0.03] py-[11px] shadow-searchBox">
              <Image
                src={"/assets/search.svg"}
                width={22}
                height={22}
                className="absolute  left-3  top-1/2 flex-1 -translate-y-1/2 transform"
              />
              <input
                onChange={(e) => {
                  setsourceQuery(e.target.value);
                }}
                value={sourceQuery}
                type="text"
                className="h-full w-full bg-transparent pl-11 pr-4 outline-none placeholder:text-sm placeholder:capitalize placeholder:text-[#999999]"
                placeholder="Search..."
              />
            </div>
            {allMemories.length > 0 ? (
              <div className="no-scrollbar flex h-full flex-col items-center gap-7 overflow-y-auto scroll-smooth">
                {/* <TravelCard data={allMemories} fetchData={getMemories} /> */}
                {allMemories?.map((item, index) => (
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
                        src={item.imgUrl}
                        alt="images"
                        className="h-[140px]  w-[210px] max-w-full rounded-[5px] object-cover"
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
                          <button
                            onClick={() => handleEditForm(item)}
                            className="group"
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
              </div>
            ) : (
              <div className="no-scrollbar mt-20 flex flex-col items-center gap-20 overflow-y-auto scroll-smooth">
                <div className="flex w-full flex-col items-center gap-4">
                  <Image
                    src={"/assets/like.svg"}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <h2 className="text-lg font-medium capitalize text-textColor">
                    No Memory Yet
                  </h2>
                  <p className="w-[260px] text-center text-sm font-normal text-textColor/60">
                    Click “Add New Memory” to create your new memories which
                    will be shown on the map.
                  </p>
                </div>

                <div className=" flex h-full justify-center ">
                  <div className=" flex w-[460px] flex-col gap-3 ">
                    <div className="flex items-center gap-1">
                      <Image
                        src={"/assets/info.svg"}
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <p className="text-xs font-normal uppercase text-textColor">
                        Here's how it works:
                      </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 rounded-xl border border-textColor/[0.08] p-5">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium capitalize text-primaryGreen">
                          City, Your Stage
                        </h3>
                        <p className="text-[13px] font-normal text-textColor">
                          Input the name of the city you visited. It's your
                          little space to let that city shine!
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium capitalize text-primaryGreen">
                          City, Your Stage
                        </h3>
                        <p className="text-[13px] font-normal text-textColor">
                          Input the name of the city you visited. It's your
                          little space to let that city shine!
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium capitalize text-primaryGreen">
                          City, Your Stage
                        </h3>
                        <p className="text-[13px] font-normal text-textColor">
                          Input the name of the city you visited. It's your
                          little space to let that city shine!
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium capitalize text-primaryGreen">
                          City, Your Stage
                        </h3>
                        <p className="text-[13px] font-normal text-textColor">
                          Input the name of the city you visited. It's your
                          little space to let that city shine!
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium capitalize text-primaryGreen">
                          City, Your Stage
                        </h3>
                        <p className="text-[13px] font-normal text-textColor">
                          Input the name of the city you visited. It's your
                          little space to let that city shine!
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium capitalize text-primaryGreen">
                          City, Your Stage
                        </h3>
                        <p className="text-[13px] font-normal text-textColor">
                          Input the name of the city you visited. It's your
                          little space to let that city shine!
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium capitalize text-primaryGreen">
                          City, Your Stage
                        </h3>
                        <p className="text-[13px] font-normal text-textColor">
                          Input the name of the city you visited. It's your
                          little space to let that city shine!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative flex w-1/2 flex-col gap-2 bg-white">
          <div className="z-50 flex w-full justify-center p-5">
            <div className=" rounded-lg bg-white  shadow-searchBox">
              {allMemories.length === 0 ? (
                <div className="px-3 py-3">
                  <span className="text-sm   font-medium capitalize text-textColor">
                    No Memory
                  </span>
                </div>
              ) : (
                <div className=" flex w-[218px] items-center justify-center px-3 py-4 text-sm  font-medium capitalize">
                  <div className="flex items-center gap-1">
                    <Image
                      src={"/assets/flag-fill.svg"}
                      width={18}
                      height={18}
                    />
                    <span className="text-sm font-medium capitalize">
                      {country} Countries
                    </span>
                  </div>
                  <span className="mx-auto h-full w-[1px] bg-black/[0.01]"></span>
                  <div className="flex items-center gap-1">
                    <Image src={"/assets/map-pin.svg"} width={18} height={18} />
                    <span className="text-sm font-medium capitalize">
                      {city} Cities
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* map */}
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
            <MapContainer
              style={{ width: "100%", height: "100%", zIndex: "49" }}
              center={[latitude, longitude]}
              zoom={1.5}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {allMemories?.map((item, index) => (
                <Marker
                  key={index}
                  position={[item.latitude, item.longitude]}
                  icon={
                    new L.Icon({
                      iconUrl: "/assets/map-pin.svg",
                      iconSize: [48, 60],
                      iconAnchor: [12.5, 41],
                      popupAnchor: [0, -41],
                      shadowUrl: MarkerShadow.src,
                      shadowSize: [41, 41],
                    })
                  }
                >
                  <Popup closeButton={false}>
                    <div className="flex w-[180px] flex-col  gap-4 rounded-xl bg-white">
                      <Image
                        src={"/assets/flowers.jpg"}
                        width={196}
                        height={100}
                        className="w-full object-contain"
                      />
                      <div className="flex flex-col">
                        <h2 className="text-start text-base font-medium capitalize text-textColor">
                          {item.full_address}
                        </h2>
                        <span className="text-xs font-normal capitalize text-primaryGreen">
                          {item.address}
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
                            {item.eDate}
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
                          <span className="ml-4 text-sm font-medium text-textColor">
                            {item.mod}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteMemories(item._id)}
                          className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#FF4F4F]/[0.05] px-3 py-2 text-xs capitalize text-[#FF4F4F]"
                        >
                          <Image
                            src={"/assets/trash.svg"}
                            width={12}
                            height={12}
                            className="object-contain"
                          />
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditForm(item)}
                          className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-[#7B7B7B]/[0.08] px-3 py-2 text-xs capitalize text-[#7B7B7B]"
                        >
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
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* {allMemories !== "undefined" ? (
              <Map data={allMemories} />
            ) : (
              <Map data={[]} />
            )}
            <Map data={[]} /> */}
            {/* {allMemories !== undefined ? (
              <Map data={allMemories} isOpen={handleEditForm} />
            ) : null} */}
          </div>
        </div>
      </div>
      <AddForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        userId={session?.user?.id}
        fetchData={getMemories}
      />
      <EditForm
        isOpen={isEditFormOpen}
        onClose={handleCloseEditForm}
        userId={session?.user?.id}
        item={editItem}
        fetchData={getMemories}
      />
    </div>
  );
};

export default MapPage;
