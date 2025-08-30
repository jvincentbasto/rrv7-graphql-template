import { useState } from "react";
import { FaUser } from "react-icons/fa";

import { useMutation } from "@apollo/client/react";
import { ADD_CLIENT } from "../../graphql/mutations/clientMutations";
import { GET_CLIENTS } from "../../graphql/queries/clientQueries";

interface AddClientData {
  addClient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}
interface GetClientsData {
  clients: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }[];
}

function ToggleBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="btn btn-soft btn-primary flex items-center"
      onClick={onClick}
    >
      <FaUser className="icon" />
      <div>Add Client</div>
    </button>
  );
}
function ModalHeader({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="card-actions justify-end mt-[10px]">
      <p className="font-bold text-[16px] uppercase">Add Client</p>
      <button className="btn btn-square btn-sm" onClick={onToggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
function ClientForm({
  form,
  onChange,
  onSubmit,
  loading,
}: {
  form: { name: string; email: string; phone: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset className="fieldset w-full border-base-300 rounded-box ">
        <label className="label mt-[0px]">Name</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Name"
          id="name"
          value={form.name}
          onChange={onChange}
        />
        <label className="label mt-[10px]">Email</label>
        <input
          type="email"
          className="input w-full"
          placeholder="Email"
          id="email"
          value={form.email}
          onChange={onChange}
        />
        <label className="label mt-[10px]">Phone</label>
        <input
          type="tel"
          className="input w-full"
          placeholder="Phone"
          id="phone"
          value={form.phone}
          onChange={onChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-4"
        >
          Add Client
        </button>
      </fieldset>
    </form>
  );
}
function Modal({
  toggle,
  onToggle,
  children,
}: {
  toggle: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  if (!toggle) return null;

  return (
    <div className="card bg-base-100 w-full max-w-[450px] shadow-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%] z-[50]">
      <div className="card-body">
        <ModalHeader onToggle={onToggle} />
        {children}
      </div>
    </div>
  );
}

export default function AddClientModal() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [toggle, setToggle] = useState(false);

  const [createClient, mCtxAddClient] = useMutation<AddClientData>(ADD_CLIENT, {
    update: (cache, { data }) => {
      if (!data?.addClient) return;

      const existing = cache.readQuery<GetClientsData>({
        query: GET_CLIENTS,
      });

      if (existing?.clients) {
        cache.writeQuery<GetClientsData>({
          query: GET_CLIENTS,
          data: { clients: [...existing.clients, data.addClient] },
        });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, phone } = form;
    if (!name || !email || !phone) return alert("Please fill in all fields");

    createClient({ variables: { ...form } });
    setForm({ name: "", email: "", phone: "" });
    setToggle(false);
  };

  return (
    <>
      <ToggleBtn onClick={() => setToggle((s) => !s)} />
      <Modal toggle={toggle} onToggle={() => setToggle((s) => !s)}>
        <ClientForm
          form={form}
          onChange={handleChange}
          onSubmit={onSubmit}
          loading={mCtxAddClient.loading}
        />
      </Modal>
    </>
  );
}
