import { useEffect, useState } from "react";
import FormProfileXh from "./FormProfileXh";
import ChangePasswordXh from "../FormUserConfig/ChangePasswordXh";
import DeleteXh from "../FormUserConfig/DeleteXh";
import ModalXh from "../FormUserConfig/ModalXh";

export default function ConfigurationXh() {

  const [userData, setUserData] = useState(null);
  const [showModalXh, setShowModalXh] = useState(false);
  const [showChangePasswordXh, setShowChangePasswordXh] = useState(false);
  const [showDeleteXh, setShowDeleteXh] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUserData(data);
    };
    fetchUser();
  }, []);


  const handleUpdateProfile = async (updatedForm) => {
    const res = await fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(updatedForm),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    setUserData(data);
    setShowModalXh(false);
  };

  if (!userData) return <p>Cargando datos...</p>;

  return (
    <div className="w-full flex flex-col items-center">

      <FormProfileXh
        userData={userData}
        onUpdate={(form) => {
          setShowModalXh(true);
          setUserData(form);
        }}
        onChangePassword={() => setShowChangePasswordXh(true)}
        onDeleteAccount={() => setShowDeleteXh(true)}
      />

      {showModalXh && (
        <ModalXh
          message="¿Confirmas guardar los cambios?"
          onConfirm={() => handleUpdateProfile(userData)}
          onClose={() => setShowModalXh(false)}
        />
      )}

      {showChangePasswordXh && (
        <ChangePasswordXh
          onClose={() => setShowChangePasswordXh(false)}
          onSubmit={async (passwordData) => {
            await fetch("/api/user/password", {
              method: "PUT",
              body: JSON.stringify(passwordData),
              headers: { "Content-Type": "application/json" }
            });
            setShowChangePasswordXh(false);
          }}
        />
      )}

      {showDeleteXh && (
        <DeleteXh
          onClose={() => setShowDeleteXh(false)}
          onConfirm={() => {
            fetch("/api/user/delete", { method: "POST" });
            setShowDeleteXh(false);
          }}
        />
      )}
    </div>
  );
}




