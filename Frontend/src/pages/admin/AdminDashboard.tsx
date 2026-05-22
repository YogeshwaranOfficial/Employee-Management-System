import { useEffect, useState } from "react";
import api from "../../services/api";
import { Phone, Building2, User, Briefcase, IdCard , ClipboardList, BadgeCheck } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
  phone?: string;
  gender?: string;
  department?: string;
  jobTitle?: string;
  employeeId?: string;
  status?: string;
};

type ErrorType = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  employeeId?: string;
  gender?: string;
  department?: string;
  jobtitle?: string;
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [toast, setToast] = useState("");
  const [undoUser, setUndoUser] = useState<User | null>(null);
  const [undoTimer, setUndoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState("");

  // FORM STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [imageUrl, setImageUrl] = useState("");

  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [errors,setErrors] = useState<ErrorType>({});

  //image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  //handle image upload 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Validate type
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert("Only JPG and PNG allowed");
    return;
  }

  // Validate size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("Max size is 2MB");
    return;
  }

  setImageFile(file);

  // Preview
  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);
};


  //Validate
const validate = (): ErrorType => {
  const newErrors: ErrorType = {};

  // NAME
  if (!name.trim()) {
    newErrors.name = "Name is required";
  } else if(!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)){
    newErrors.name = `Name formats "John Doe", "O'Connor", "Anna-Marie", "Robert Jr."`
  }

  // EMAIL
  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Invalid email format";
  }

  // PASSWORD (ONLY FOR CREATE)
  if (!editingUser) {
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
    ) {
      newErrors.password =
        "Min 8 chars, include uppercase, lowercase, number & symbol";
    }
  }

  // PHONE
  if (!phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^[0-9]{10}$/.test(phone)) {
    newErrors.phone = "Phone must be exactly 10 digits";
  }


  // Gender
  if (!gender.trim()) {
    newErrors.gender = "Gender is required";
  }

  // Department
  if (!department.trim()) {
    newErrors.department = "Department is required";
  }

  // Jobtitle
  if (!jobTitle.trim()) {
    newErrors.jobtitle = "Jobtitle is required";
  }

  return newErrors;
};

  //  FETCH USERS
  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers([...res.data.data]);
  };

  useEffect(() => {
  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data);
  };

  void loadUsers();
}, []);

  //  LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  //  ADD
  const openAddModal = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("EMPLOYEE");
    setImageUrl("");
    setPhone("");
    setGender("");
    setDepartment("");
    setJobTitle("");
    setEmployeeId("");
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    setIsModalOpen(true);
  };

  //  EDIT
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setImageUrl(user.imageUrl || "");
    setPhone(user.phone || "");
    setGender(user.gender || "");
    setDepartment(user.department || "");
    setJobTitle(user.jobTitle || "");
    setEmployeeId(user.employeeId || "");
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    setIsModalOpen(true);
  };

  const openConfirm = (message: string, action: () => void) => {
  setConfirmMessage(message);
  setConfirmAction(() => action);
  setConfirmOpen(true);   
  };

  
  const openViewModal = (user: User) => {
    setSelectedUser(user);
  };


 const handleDelete = (user: User) => {
  openConfirm("Are you sure you want to delete this employee?", async () => {
    setUndoUser(user);

    const timer = setTimeout(async () => {
      await api.delete(`/users/${user.id}`);
      fetchUsers();
      setToast("Employee deleted successfully");
      setUndoUser(null);
    }, 5000);

    setUndoTimer(timer);
  });
};

  // UNDO DELETE
  const handleUndo = () => {
    if (undoTimer) {
  clearTimeout(undoTimer);
}
    setUndoUser(null);
    setToast("Delete cancelled"); 
    setTimeout(() => {
      setToast("");
    }, 5000); 
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    //  CHECK: use FormData ONLY if image file exists
    const isFileUpload = imageFile instanceof File;

    let payload: FormData | {
      name: string;
      email: string;
      password: string;
      role: string;
      imageUrl: string;
      phone: string;
      gender: string;
      department: string;
      jobTitle: string;
      employeeId: string;
    };

    if (isFileUpload) {
      // FormData (for image upload)
      payload = new FormData();

      payload.append("name", name);
      payload.append("email", email);
      payload.append("password", password);
      payload.append("role", role);
      payload.append("phone", phone);
      payload.append("gender", gender);
      payload.append("department", department);
      payload.append("jobTitle", jobTitle);
      payload.append("employeeId", employeeId);

      payload.append("image", imageFile); // IMPORTANT
    } else {
      //  Keep your OLD payload (no breaking change)
      payload = {
        name,
        email,
        password,
        role,
        imageUrl, // fallback (old logic still works)
        phone,
        gender,
        department,
        jobTitle,
        employeeId,
      };
    }

    // CREATE
    if (!editingUser) {
      openConfirm("Are all the mentioned details correct?", async () => {
        await api.post("/users", payload);

        setToast("Employee created successfully");
        setIsModalOpen(false);
        fetchUsers();

        setTimeout(() => setToast(""), 5000);
      });

      return;
    }

    // EDIT
    await api.patch(`/users/${editingUser.id}`, payload);

    setToast("Employee updated successfully");

    setTimeout(() => setToast(""), 5000);

    setIsModalOpen(false);
    fetchUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
    {/* NAVBAR */}
    <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg shadow-md px-6 py-4">
      {/* TOP ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
          Admin Dashboard
        </h1>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl shadow-sm font-medium"
          >
            + Add Employee
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-xl shadow-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
      {/* SEARCH BAR */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search employees by name ..."
          className="w-full md:w-1/2 lg:w-full px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

    </div>
      <div className="pt-33">
      {/* ALL YOUR PAGE CONTENT */}
      {/* CARDS */}
          <div className="p-5 z-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-center text-center"
              >
                <div className="flex sm:flex-col md:flex-col xl:flex-row gap-5 mt-5">
                  <div>
                    <img src={
                         user.imageUrl || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                        }
                        className="w-40 h-70 rounded-lg m-4 object-cover shadow-2xl border-10 border-gray-300"
                      />
                  </div>
              
                  <div className="flex flex-col text-start mt-5">
                    <h1 className="text-xl font-bold mb-5">{user.name}</h1>
                    <div  className="flex flex-row gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="black" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        <p className="text-gray-800 font-semibold text-sm ">{user.email}</p>
                    </div>
                    <div  className="flex flex-row gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="black" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        <p className="text-gray-800 font-semibold  text-sm">{user.phone}</p>
                    </div>
                    <div  className="flex flex-row gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="black" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                        <p className="text-gray-800 font-semibold  text-sm ">{user.jobTitle}</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-5 w-40 lg:w-full">
                  <button onClick={() => openViewModal(user)} className="bg-blue-400 text-white px-3 py-1 rounded hover:scale-103">
                    View
                  </button>

                  <button onClick={() => openEditModal(user)} className="bg-yellow-300 text-white px-3 py-1 rounded hover:scale-103">
                    Edit
                  </button>

                  <button onClick={() => handleDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded hover:scale-103">
                    Delete
                  </button>
                </div>
                  </div>
                </div>
              </div>    
            ))}
          </div>
       </div>
      
      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-6 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* UNDO POPUP */}
      {undoUser && (
        <div className="fixed bottom-5 left-5 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg flex gap-3 items-center">
          Employee data will be delete in 5 seconds 
          <button onClick={handleUndo} className="bg-yellow-400 px-3 py-1 rounded text-black">
            Undo
          </button>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-1000">

          <div className="bg-white w-[90%] md:w-100 rounded-2xl shadow-xl p-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Action
            </h2>

            <p className="text-gray-500 mt-2">
              {confirmMessage}
            </p>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  confirmAction();
                  setConfirmOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirm
              </button>

            </div>
          </div>
        </div>
      )}

      {/* view button */}
      {selectedUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">

            {/* MODAL */}
            <div className="bg-white w-[92%] md:w-[80%] h-[90%] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden">

              {/* HEADER */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
                  Employee Details
                </h2>

                <div className="px-1flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-red rounded-lg text-xl font-medium transition"
                >
                  X
                </button>
              </div>
              </div>

              {/* BODY */}
              <div className="px-6 py-6 space-y-6">

                {/* PROFILE SECTION */}
                <div className="flex items-center gap-5">

                  <img
                     src={
                        selectedUser.imageUrl ||
                        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                      }
                      className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-md"
                    />

                  <div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                      {selectedUser.name}
                    </h3>

                    <p className="text-gray-500 text-lg">
                      {selectedUser.email}
                    </p>

                    {/* BADGES */}
                    <div className="flex gap-2 mt-3">
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                        <span className="w-2 h-2 bg-green-500 text-sm rounded-full"></span>
                        Active
                      </span>

                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-200"></div>

                {/* INFO SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* PERSONAL */}
                  <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                    <h4 className="text-sm md:text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
                       <BadgeCheck className="w-6 h-7 text-blue-600" />
                       Personal Information
                    </h4>

                    <div className="space-y-4 text-sm">

                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow">
                          <Phone className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-md my-2">Phone</p>
                          <p className="font-medium text-gray-800 text-md">
                            {selectedUser.phone || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-md my-2">Gender</p>
                          <p className="font-medium text-gray-800 text-md">
                            {selectedUser.gender || "—"}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* WORK */}
                  <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                    <h4 className="text-xl font-semibold text-blue-600 flex items-center gap-2 mb-4">
                      <ClipboardList className="w-6 h-7 text-blue-600" />
                       Work Information
                    </h4>

                    <div className="space-y-4 text-sm">

                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow">
                          <Building2 className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm my-2">Department</p>
                          <p className="font-medium text-gray-800 text-sm">
                            {selectedUser.department || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow">
                          <Briefcase className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm my-2">Job Title</p>
                          <p className="font-medium text-gray-800 text-sm">
                            {selectedUser.jobTitle || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="bg-white p-2 rounded-lg shadow">
                          <IdCard className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm my-2">Employee ID</p>
                          <p className="font-medium text-gray-800 text-sm">
                            {selectedUser.employeeId || "—"}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-white rounded-lg text-2xl font-medium transition"
                >
                  X
                </button>
              </div>

            </div>
          </div>
        )}

      {/* Create employee and Edit employee */}
      {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

              {/* MODAL CONTAINER */}
              <div className="bg-white w-[90%] md:w-[80%] h-[85%] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-8 py-5 border-b">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    {editingUser ? "Edit Employee" : "Add Employee"}
                  </h2>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* FORM CONTENT */}
                <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-lg"
          >

            {/* BASIC INFO */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Basic Information
              </h3>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-600 mb-1 text-md">Full Name</label>
            <input
                  className={`w-full p-2 rounded-xl outline-none ${
                    errors.name ? "border border-red-500" : "bg-gray-100"
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
            </div>

            <div className="col-span-2">
              <label className="block text-gray-600 text-md mb-1">Email Address</label>
              <input
                  className={`w-full p-2 rounded-xl outline-none ${
                    errors.email ? "border border-red-500" : "bg-gray-100"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            {!editingUser && (
              <div className="col-span-2">
                <label className="block text-gray-600 text-md mb-1">Password</label>
                <input
                    type="password"
                    className={`w-full p-2 rounded-xl outline-none ${
                      errors.password ? "border border-red-500" : "bg-gray-100"
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
              </div>
            )}

            {/* WORK INFO */}
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Work Details
              </h3>
            </div>

            <div>
          <label className="block text-gray-600 text-md mb-1">Employee ID</label>

          <input
            readOnly
            className="w-full p-2 rounded-xl bg-gray-200 cursor-not-allowed outline-none select-none text-gray-700"
            value={employeeId || "Will assign by admin..."}
          />

        </div>

            <div>
              <label className="block text-gray-600 text-md mb-1">Phone</label>
              <input
                  className={`w-full p-2 rounded-xl outline-none ${
                    errors.phone ? "border border-red-500" : "bg-gray-100"
                  }`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
            </div>

            <div>
              <label className="block text-gray-600 text-md mb-1">Department</label>
              <input
                  className={`w-full p-2 rounded-xl outline-none ${
                    errors.department ? "border border-red-500" : "bg-gray-100"
                  }`}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />

                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
            </div>

            <div>
              <label className="block text-gray-600 text-md mb-1">Job Title</label>
              <input
                  className={`w-full p-2 rounded-xl outline-none ${
                    errors.jobtitle ? "border border-red-500" : "bg-gray-100"
                  }`}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />

                {errors.jobtitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobtitle}</p>
                )}
            </div>

            <div className="w-full">
            <label className="block text-gray-600 mb-2 text-=md font-medium">
              Gender
            </label>

            <div className="relative">
              <select
                className={`w-full appearance-none p-2 pr-10 bg-gray-100 rounded-xl outline-none 
                          focus:ring-2 focus:ring-blue-500 transition text-gray-800 font-medium
                        ${
                    errors.gender ? "border border-red-500" : "bg-gray-100"
                  }`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >

                
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
                {errors.gender  && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              {/* Custom Arrow */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                 <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
              </div>
            </div>
          </div>

          <div className="w-full">
                <label className="block text-gray-600 mb-2 text-md font-medium">
                  Role
                </label>

                <div className="relative">
                  <select
                    className="w-full appearance-none p-2 pr-10 bg-gray-100 rounded-xl outline-none 
                              focus:ring-2 focus:ring-blue-500 transition text-gray-800 font-medium"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  {/* Custom Arrow */}
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            {/* IMAGE */}
            <div className="col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Profile Image
              </h3>
            </div>

            <div className="col-span-2">
                <label className="block text-gray-600 text-md mb-2">Upload Image</label>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-gray-100 rounded-xl cursor-pointer"
                />

                {/* PREVIEW */}
                {(imagePreview || imageUrl) && (
                  <img
                    src={imagePreview || imageUrl}
                    alt="preview"
                    className="mt-4 w-30 h-30 object-cover rounded-lg border"
                  />
                )}
              </div>

            {/* BUTTONS */}
            <div className="col-span-2 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 rounded-xl text-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 transition text-white px-6 py-3 rounded-xl text-lg font-semibold"
              >
                {editingUser ? "Update Employee" : "Create Employee"}
              </button>
            </div>

          </form>
              </div>
            </div>
        )}

    </div>
  );
};

export default AdminDashboard;