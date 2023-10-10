import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const initialFormData = {
  userId: "",
  imgUrl: "",
  address: "",
  full_address: "",
  latitude: "",
  longitude: "",
  sDate: "",
  eDate: "",
  mod: "",
  description: "",
};
function EditForm({ isOpen, onClose, userId, item, fetchData }) {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [source, setSource] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceChange, setSourceChange] = useState(false);
  const router = useRouter();
  const getItemDetails = (item) => {
    if (item !== null && item !== undefined) {
      setSelectedImage(item.imgUrl);
      setSource(item.address);
      setFormData({ ...formData, ...item });
    }
  };
  useEffect(() => {
    getItemDetails(item);
  }, [item]);
  useEffect(() => {
    const delayDebouncefn = setTimeout(() => {
      getAddressList();
    }, 1000);
    return () => clearTimeout(delayDebouncefn);
  }, [source]);
  // get address
  const getAddressList = async () => {
    const res = await fetch("api/search-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    });
    const results = await res.json();
    console.log("results :", results.data);
    setAddressList(results.data);
  };

  const onSourceAddressClick = async (item) => {
    if (item.full_address) {
      setSource(item.full_address);
    } else {
      setSource(item.place_formatted);
    }
    setAddressList([]);
    setSourceChange(false);
    const res = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${item.mapbox_id}?session_token=0e440102-91ff-4641-88af-25305a50251e&access_token=pk.eyJ1IjoieXRtdHJhdmVscyIsImEiOiJjbG16cjgzdngwZXc0MnVtdndqdmhuYjRkIn0.Q8Ibf9RixuOwg58ux7CHAg`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const result = await res.json();
    setFormData({
      ...formData,
      address: result.features[0].properties?.name,
      full_address: result.features[0].properties?.place_formatted,
      city: result.features[0].properties?.context?.region?.name,
      country: result.features[0].properties?.context?.country?.name,
      latitude: result.features[0].properties?.coordinates?.latitude,
      longitude: result.features[0].properties?.coordinates?.longitude,
    });

    console.log("source address: ", item);
  };

  console.log(isOpen);
  console.log("url: ", selectedImage);
  useEffect(() => {
    console.log(selectedImage);
  }, [selectedFile]);
  const handleCancelClick = () => {
    setSelectedFile(null);
    setSelectedImage("");
    setFormData(initialFormData);
    onClose(); // Call the onClose function when the cancel button is clicked
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.log("formData : something went wrong!");
      return;
    }
    // Step 1: Upload the image
    const imageFormData = new FormData();
    imageFormData.set("file", selectedFile);

    try {
      setIsLoading(true);
      const imageResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        console.error("client side Image upload failed.", imageResponse.status);
        return;
      }
      const imageURL = await imageResponse.json();
      console.log("imageURL: ", imageURL);
      // Step 2: Save the form data with the image URL to MongoDB
      const formDataWithImageURL = {
        ...formData,
        imgUrl: `/assets/memories/${selectedFile.name}`,
      };
      const res = await fetch(`api/memory/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithImageURL),
      });
      if (res.ok) {
        fetchData();
        setFormData(initialFormData);
        setSource("");
        setSelectedImage("");
        console.log("formData: memory saved successfully!");
      } else {
        console.error("Error saving form data.");
      }
    } catch (error) {
      console.log("formData: ", error);
    } finally {
      router.refresh();
      toast.success("Your memory saved with us");
      setIsLoading(false);
      onClose(); // Call the onClose function when the cancel button is clicked
    }
  };
  return (
    <div
      className={`no-scrollbar absolute left-1/2 top-1/2 z-[200] ${
        isOpen ? "" : "hidden"
      }  h-full w-full -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto bg-black/40`}
    >
      <div className=" mx-auto  max-w-[340px] rounded-xl bg-white p-5 md:max-w-[380px]">
        <h2 className="text-[21px] font-bold capitalize text-[#121212]">
          Update your memory
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-darkGray">Upload Image</p>

            <label
              htmlFor="dropzone-editfile"
              className="flex w-full cursor-pointer items-center justify-center rounded-lg border-[2px] border-dashed border-primaryGreen bg-primaryGreen/10"
            >
              <div className="flex  w-full items-center justify-start gap-10 p-3 md:flex-col md:items-center md:gap-3 md:p-6">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    width={150}
                    height={150}
                    className="h-auto flex-1 object-contain "
                  />
                ) : (
                  <>
                    <Image
                      src={"/assets/image-fill.svg"}
                      width={24}
                      height={24}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                      Select an Image
                    </p>
                    <p className="hidden md:block md:text-sm md:font-medium md:text-textColor">
                      Drag & Drop Your Image or,{" "}
                      <span className="text-primaryGreen underline">
                        Browse
                      </span>
                    </p>
                    <p className="hidden text-[10px] capitalize text-textColor opacity-60 md:block ">
                      Max: 1 image
                    </p>
                  </>
                )}
              </div>
              <input
                id="dropzone-editfile"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="  flex flex-col items-start justify-center gap-2">
            <label
              htmlFor=""
              className="text-sm font-medium capitalize text-[#121212]"
            >
              Visited City
            </label>
            <div className="relative w-full">
              <input
                onChange={(e) => {
                  setSource(e.target.value);
                  setSourceChange(true);
                }}
                value={source}
                type="text"
                id="location"
                name="location"
                className="w-full rounded-lg border border-black/10 bg-white/5 px-4 py-3 text-sm outline-none  placeholder:text-[#121212]/60"
                placeholder="Enter a Location"
              />
              {addressList?.suggestions && sourceChange ? (
                <div
                  className="absolute left-0 top-12 z-[22]
            w-full rounded-md bg-white p-1 shadow-md"
                >
                  {addressList?.suggestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        onSourceAddressClick(item);
                      }}
                      className="cursor-pointer p-3
                hover:bg-gray-100"
                    >
                      <p className="text-base font-medium ">{item.name}</p>
                      <p className="text-xs">{item.place_formatted}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              htmlFor=""
              className="text-sm font-medium capitalize text-[#121212]"
            >
              Travel Date (Start)
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, sDate: e.target.value })
              }
              value={formData.sDate}
              type="date"
              id="sDate"
              name="sDate"
              className="w-full rounded-lg border border-black/10 bg-white/5 px-4 py-3 text-sm outline-none  placeholder:text-[#121212]/60"
              placeholder="DD/MM/YYYY"
            />
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              htmlFor=""
              className="text-sm font-medium capitalize text-[#121212]"
            >
              Travel Date (End)
            </label>
            <input
              onChange={(e) =>
                setFormData({ ...formData, eDate: e.target.value })
              }
              value={formData.eDate}
              type="date"
              id="eDate"
              name="eDate"
              className="w-full rounded-lg border border-black/10 bg-white/5 px-4 py-3 text-sm outline-none  placeholder:text-[#121212]/60"
              placeholder="DD/MM/YYYY"
            />
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              htmlFor=""
              className="text-sm font-medium capitalize text-[#121212]"
            >
              Mode of Travel
            </label>
            <select
              onChange={(e) =>
                setFormData({ ...formData, mod: e.target.value })
              }
              value={formData.mod}
              name="mode"
              id="mode"
              className="w-full  rounded-lg border border-black/10 bg-white/5 px-4 py-3 text-sm  outline-none placeholder:text-[#121212]/60  focus:border-black/10 focus:ring-0"
            >
              <option selected>select...</option>
              <option value="bus">Bus</option>
              <option value="plane">Plane</option>
              <option value="tempo">Tempo</option>
              <option value="ship">Ship</option>
            </select>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <label
              htmlFor=""
              className="text-sm font-medium capitalize text-[#121212]"
            >
              Describe a Memory
            </label>
            <textarea
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              value={formData.description}
              name="des"
              id="des"
              rows="4"
              className="w-full resize-none rounded-lg border border-black/10 bg-white/5 px-4 py-3 text-sm  outline-none placeholder:text-[#121212]/60  focus:outline-none focus:ring-0"
              placeholder="Type here..."
            ></textarea>
          </div>
          <p className="text-[13px] font-normal capitalize text-textColor">
            By adding a memory, you will be agreeing to our{" "}
            <span className="font-medium text-primaryGreen underline">
              terms & conditions
            </span>{" "}
            and{" "}
            <span className="font-medium text-primaryGreen underline">
              privacy policy
            </span>
          </p>
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full rounded-lg ${
                isLoading ? "bg-primaryGreen/60" : "bg-primaryGreen"
              }  px-[14px] py-[10px] text-base font-medium capitalize text-white`}
            >
              {isLoading ? "Processing..." : "Update Memory"}
            </button>
            <button
              onClick={handleCancelClick}
              className="w-full rounded-lg border-[1px] border-textColor/10 px-[14px] py-[10px] text-base font-medium capitalize text-textColor"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditForm;
