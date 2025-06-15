import { useEffect, useState } from "react";
import type { UserType } from "../types/index.types";
import axios from "axios";
function UserList() {
  const [isUserData, setIsUserData] = useState<UserType[]>([]);

  const fetchUserData = async () => {
    try {
      const UserInstanceData = await axios.get("/api/getAllUser");
      setIsUserData(UserInstanceData.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserData();
    console.log(isUserData);
  }, []);

  const handleDel = async (objectID: string) => {
    try {
      const userDelete = await axios.delete(`/api/deleteUser/${objectID}`);
      console.log(userDelete);

      // Update local state to remove deleted user
      setIsUserData((prev) => prev.filter((user) => user._id !== objectID));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="w-full rounded-md bg-white p-8">
        <div className="flex items-center justify-between pb-6">
          <div>
            <h2 className="font-semibold text-gray-600">Products Oder</h2>
            <span className="text-xs">All products item</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-md bg-gray-50 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="ml-1 block bg-gray-50 outline-none"
                type="text"
                name=""
                id=""
                placeholder="search..."
              />
            </div>
            <div className="ml-10 space-x-8 lg:ml-40">
              <button
                onClick={() => {
                  console.log(isUserData);
                }}
                className="cursor-pointer rounded-md bg-gray-600 px-4 py-2 font-semibold tracking-wide text-white"
              >
                New Report
              </button>
              <button className="cursor-pointer rounded-md bg-gray-600 px-4 py-2 font-semibold tracking-wide text-white">
                Create
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
            <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      products
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Created at
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      QRT
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isUserData.map((ele) => {
                    return (
                      <tr key={ele._id}>
                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-full w-full rounded-full"
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <p className="whitespace-no-wrap font-bold text-gray-900">
                                {ele.userName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap text-gray-900">
                            {ele.email}
                          </p>
                        </td>
                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap text-gray-900">
                            Jan 21, 2020
                          </p>
                        </td>
                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <p className="whitespace-no-wrap text-gray-900">43</p>
                        </td>
                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <span className="relative inline-block px-3 py-1 leading-tight font-semibold text-green-900">
                            <span
                              aria-hidden
                              className="absolute inset-0 rounded-full bg-green-200 opacity-50"
                            ></span>
                            <span className="relative">Act</span>
                          </span>
                        </td>
                        <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                          <span className="relative inline-block px-3 py-1 leading-tight font-semibold text-black">
                            <span
                              aria-hidden
                              className="absolute inset-0 rounded-full bg-red-200 opacity-50"
                            ></span>
                            <button
                              onClick={() => {
                                if (ele._id) handleDel(ele._id);
                              }}
                              className="relative"
                            >
                              Delete
                            </button>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
