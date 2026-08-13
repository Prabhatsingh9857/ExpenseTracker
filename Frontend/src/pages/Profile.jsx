import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  X,
} from "lucide-react";

const Profile = ({ user, onUpdateProfile, onLogout }) => {
  // ======================================================
  // USER DATA
  // ======================================================

  const [name, setName] = useState(
    user?.name || user?.username || user?.fullName || ""
  );

  const [email, setEmail] = useState(user?.email || "");

  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto || user?.photo || ""
  );

  // ======================================================
  // EDIT PROFILE
  // ======================================================

  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState("");

  // ======================================================
  // PASSWORD
  // ======================================================

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ======================================================
  // UPDATE USER WHEN PROP CHANGES
  // ======================================================

  useEffect(() => {
    setName(
      user?.name ||
        user?.username ||
        user?.fullName ||
        ""
    );

    setEmail(user?.email || "");

    setProfilePhoto(
      user?.profilePhoto ||
        user?.photo ||
        ""
    );
  }, [user]);

  // ======================================================
  // AVATAR LETTER
  // ======================================================

  const avatarLetter =
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  // ======================================================
  // PHOTO CHANGE
  // ======================================================

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check image type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Limit file size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setProfilePhoto(imageData);

      // Save photo locally so it remains after refresh
      localStorage.setItem(
        "profilePhoto",
        imageData
      );

      setMessage("Profile photo selected.");
    };

    reader.readAsDataURL(file);
  };

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSaveProfile = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      profilePhoto: profilePhoto,
    };

    // Update App.jsx state
    if (onUpdateProfile) {
      onUpdateProfile(updatedUser);
    }

    // Save locally
    localStorage.setItem(
      "profilePhoto",
      profilePhoto || ""
    );

    setIsEditing(false);

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ======================================================
  // CHANGE PASSWORD
  // ======================================================

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (!currentPassword) {
      alert("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      alert("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    /*
      IMPORTANT:

      This only handles the frontend UI.

      Your backend must have an API such as:

      PUT /api/user/change-password

      to actually change the password in MongoDB.
    */

    console.log("Change password request:", {
      currentPassword,
      newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowPasswordSection(false);

    setMessage("Password change request submitted.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const handleCancelEdit = () => {
    setName(
      user?.name ||
        user?.username ||
        user?.fullName ||
        ""
    );

    setEmail(user?.email || "");

    setProfilePhoto(
      user?.profilePhoto ||
        user?.photo ||
        localStorage.getItem("profilePhoto") ||
        ""
    );

    setIsEditing(false);
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto w-full max-w-4xl">

        {/* ==================================================
            PROFILE HEADER
        ================================================== */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* HEADER */}
          <div className="bg-teal-600 px-6 py-10 text-center">

            <div className="flex items-center justify-center">

              {/* PHOTO */}
              <div className="flex items-center">

                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white text-3xl font-bold text-teal-600 shadow-lg">

                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    avatarLetter
                  )}

                </div>

                {/* EDIT TEXT */}
                {isEditing && (
                  <label
                    htmlFor="profile-photo"
                    className="ml-3 cursor-pointer text-sm font-semibold text-white underline hover:text-gray-100"
                  >
                    Edit
                  </label>
                )}

                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

              </div>

            </div>

            <h1 className="mt-4 text-2xl font-bold text-white">
              {name || "User"}
            </h1>

            <p className="mt-1 text-sm text-teal-100">
              {email || "No email available"}
            </p>

          </div>

          {/* ==================================================
              PROFILE CONTENT
          ================================================== */}

          <div className="p-6">

            {/* SUCCESS MESSAGE */}

            {message && (
              <div className="mb-5 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle className="h-5 w-5" />
                {message}
              </div>
            )}

            {/* ==================================================
                PROFILE INFORMATION
            ================================================== */}

            <div className="flex items-center justify-between border-b border-gray-200 pb-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your personal information
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Edit Profile
                </button>
              )}

            </div>

            {/* ==================================================
                PROFILE FORM
            ================================================== */}

            <form
              onSubmit={handleSaveProfile}
              className="mt-6 space-y-5"
            >

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm text-gray-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-50"
                    placeholder="Enter your name"
                  />

                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm text-gray-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-50"
                    placeholder="Enter your email"
                  />

                </div>
              </div>

              {/* SAVE / CANCEL */}

              {isEditing && (
                <div className="flex gap-3 pt-2">

                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>

                </div>
              )}

            </form>

            {/* ==================================================
                PASSWORD SECTION
            ================================================== */}

            <div className="mt-8 border-t border-gray-200 pt-6">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <Lock className="h-5 w-5 text-teal-600" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-gray-800">
                      Password
                    </h2>

                    <p className="text-sm text-gray-500">
                      Change your account password
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordSection(
                      !showPasswordSection
                    )
                  }
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  {showPasswordSection
                    ? "Cancel"
                    : "Change Password"}
                </button>

              </div>

              {/* PASSWORD FORM */}

              {showPasswordSection && (
                <form
                  onSubmit={handleChangePassword}
                  className="mt-5 space-y-4 rounded-xl bg-gray-50 p-5"
                >

                  {/* CURRENT PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        placeholder="Enter current password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* NEW PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      New Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* CHANGE PASSWORD BUTTON */}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </button>

                </form>
              )}

            </div>

            {/* ==================================================
                LOGOUT
            ================================================== */}

            <div className="mt-8 border-t border-gray-200 pt-6">

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;