import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const [user, setUser] = useState(storedUser || {});
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(user);

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem("user");
    
console.log(storedUser)
    if (!storedUser) {
      console.error("No user data found in sessionStorage");
      return;
    }
 const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser._id;

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_PORT}/api/users/${userId}`);
          setUser(response.data);
          setFormData(response.data);
          sessionStorage.setItem("user", JSON.stringify(response.data)); // Update sessionStorage
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [field]: value },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser.token;
      const userId = parsedUser._id;

      const response = await axios.put(
        `${process.env.REACT_APP_BACK_PORT}/api/users/${userId}`,{formData}
      );

      // Update session storage with new user data
      parsedUser.name = response.data.name;
      sessionStorage.setItem("user", JSON.stringify(parsedUser));

      setUser(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 font-comfortaa">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1572A1]">Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-[#1572A1] text-white rounded-lg hover:bg-[#125a80] transition-colors"
          >
           {editing ? (
              <button
                type="submit"
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#1572A1] text-white rounded-lg hover:bg-[#125a80] transition-colors"
              >
                Save Changes
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-[#1572A1] text-white rounded-lg hover:bg-[#125a80] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-[#1572A1]">Personal Information</h2>
            </div>
            
            <div className="mb-4">
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            {/* Address Information */}
            <div className="col-span-2 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-[#1572A1]">Address</h2>
            </div>

            <div className="mb-4">
              <label className="block font-medium">Street</label>
              <input
                type="text"
                name="address.street"
                value={formData.address?.street}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Apartment</label>
              <input
                type="text"
                name="address.apartment"
                value={formData.address?.apartment}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">House No.</label>
              <input
                type="text"
                name="address.houseNo"
                value={formData.address?.houseNo}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address?.city}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address?.state}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address?.country}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Postal Code</label>
              <input
                type="text"
                name="address.postalCode"
                value={formData.address?.postalCode}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#1572A1]"
                disabled={!editing}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
