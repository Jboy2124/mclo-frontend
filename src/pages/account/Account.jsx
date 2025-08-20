import { Outlet } from "react-router-dom";

const Account = () => {
  return (
    <main className="bg-main">
      <section className="container mx-auto">
        <div className="min-h-screen flex justify-center items-center">
          {<Outlet />}
        </div>
      </section>
    </main>
  );
};

export default Account;
