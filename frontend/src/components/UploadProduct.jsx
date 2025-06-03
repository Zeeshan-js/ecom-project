import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import axios from "axios"
import { uploadProduct } from "../api/api.js";

const UploadProduct = ({ open, onClose }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    variant: {
      size: [],
      colors: [],
    },
    stock: 0,
    price: 0,
    inventoryCount: 0,
    mainImage: {
      url: "",
      localPath: "",
    },
    subImages: [],
  });

  const [inputSize, setInputSize] = useState("");
  const [inputColor, setInputColor] = useState("");
  const [currentImage, setCurrentImage] = useState(null);

  const addSize = () => {
    const size = parseInt(inputSize);
    if (!isNaN(size) && !product.variant.size.includes(size)) {
      setProduct((prev) => ({
        ...product,
        variant: {
          ...prev.variant,
          size: [...prev.variant.size, size],
        },
      }));
    }
    setInputSize("");
  };

  const addColor = () => {
    const color = inputColor
    setProduct((prev) => ({
      ...product,
      variant: {
        ...prev.variant,
        colors: [...prev.variant.colors, color],
      },
    }));
    setInputColor("")
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setProduct((prev) => ({
        ...prev,
        mainImage: file,
      }));
      setCurrentImage(URL.createObjectURL(file))
    } else {
      console.log(file  )
    }
  };

  const handleProductUpload = async () => {
  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("stock", product.stock);
    formData.append("price", product.price);
    formData.append("mainImage", product.mainImage); // File object
    formData.append("variant", JSON.stringify(product.variant));

    await uploadProduct(formData);
    onClose()
  } catch (error) {
    console.log(error);
  }
};



  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-secondary text-zinc-400 hover:text-zinc-500 focus:outline-none"
                            onClick={handleClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-white">
                      <div>
                        <p>Product Name</p>
                        <input
                          className="border w-full"
                          type="text"
                          value={product.name}
                          onChange={(e) =>
                            setProduct({ ...product, name: e.target.value })
                          }
                          placeholder="Enter Product Name"
                        />
                      </div>

                      <div>
                        <p>Product Description</p>
                        <div className="h-23 w-full border">
                          <input
                            type="text"
                            placeholder="Description"
                            value={product.description}
                            onChange={(e) =>
                              setProduct({
                                ...product,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="mb-4">
                          <label className="block mb-1">Add Size</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={inputSize}
                              onChange={(e) => setInputSize(e.target.value)}
                              className="border px-2 py-1 rounded"
                              placeholder="Enter size e.g. 38"
                            />
                            <button
                              onClick={addSize}
                              type="button"
                              className="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                              Add
                            </button>
                          </div>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {product.variant.size.map((sz, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-black rounded text-sm"
                              >
                                {sz}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block mb-1">Add Color</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={inputColor}
                              onChange={(e) => setInputColor(e.target.value)}
                              className="border px-2 py-1 rounded"
                              placeholder="Enter color e.g. Red"
                            />
                            <button
                              onClick={addColor}
                              type="button"
                              className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Add
                            </button>
                          </div>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {product.variant.colors.map((cl, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-black rounded text-sm"
                              >
                                {cl}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <p>Stock</p>
                          <input
                            className="border"
                            value={product.stock}
                            onChange={(e) => setProduct(prev => ({
                              ...product,
                              stock: e.target.value
                            }))}
                            type="number"
                            placeholder="Enter Product stock"
                          />
                        </div>

                        <div>
                          <p>Price</p>
                          <input
                            className="border"
                            value={product.price}
                            onChange={(e) => setProduct(prev => ({
                              ...product,
                              price: e.target.value
                            }))}
                            type="number"
                            placeholder="Price"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium">Upload Main Image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                        />

                        {product.mainImage.url && (
                          <img
                            src={currentImage}
                            alt="Main Preview"
                            className="mt-2 w-48 h-auto rounded shadow"
                          />
                        )}
                      </div>

                      <button className="border p-2 rounded-2xl bg-zinc-300 text-black" onClick={handleProductUpload}>
                        Place Order
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default UploadProduct;
