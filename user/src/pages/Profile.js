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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData,name:e.target.value})}
            className="border p-2 w-full"
            disabled={!editing}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Email</label>
          <input type="email" value={formData.email} readOnly className="border p-2 w-full bg-gray-200" />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full"
            disabled={!editing}
          />
        </div>
       {/* Address Fields */}
       <h3 className="text-lg font-semibold mt-4">Address</h3>
        <div className="mb-4">
          <label className="block font-medium">Street</label>
          <input
            type="text"
            name="address.street"
            value={formData.address?.street}
            onChange={handleChange}
            className="border p-2 w-full"
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
            className="border p-2 w-full"
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
            className="border p-2 w-full"
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
            className="border p-2 w-full"
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
            className="border p-2 w-full"
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
            className="border p-2 w-full"
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
            className="border p-2 w-full"
            disabled={!editing}
          />
        </div>

        {/* Edit and Save Button */}
        {editing ? (
          <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded">
            Save Changes
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="bg-green-500 text-white p-2 rounded">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
