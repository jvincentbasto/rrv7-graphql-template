import { useState } from "react";
import { FaList } from "react-icons/fa";
import { useMutation, useQuery } from "@apollo/client/react";

import { ADD_PROJECT } from "../../graphql/mutations/projectMutations";
import { GET_PROJECTS } from "../../graphql/queries/projectQueries";
import { GET_CLIENTS } from "../../graphql/queries/clientQueries";
import Spinner from "../Spinner";

interface ProjectForm {
  name: string;
  description: string;
  clientId: string;
  status: "new" | "progress" | "completed";
}
interface AddProjectData {
  addProject: {
    id: string;
    name: string;
    description: string;
    status: string;
    client: {
      id: string;
      name: string;
    };
  };
}
interface GetProjectsData {
  projects: AddProjectData["addProject"][];
}
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}
interface GetClientsData {
  clients: Client[];
}

function ToggleButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      className="btn btn-soft btn-primary flex items-center"
      onClick={onClick}
    >
      <FaList className="icon" />
      <div>Add Project</div>
    </button>
  );
}
function ModalHeader({
  onClose,
}: {
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="card-actions justify-end mt-[10px]">
      <p className="font-bold text-[16px] uppercase">Add Project</p>
      <button className="btn btn-square btn-sm" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
function ProjectFormComponent({
  form,
  handleChange,
  onSubmit,
  statusOptions,
  clients,
  loading,
  submitting,
}: {
  form: ProjectForm;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  statusOptions: { key: string; label: string }[];
  clients: Client[] | undefined;
  loading: boolean;
  submitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset className="fieldset w-full border-base-300 rounded-box">
        <label className="label mt-[0px]">Name</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Name"
          id="name"
          value={form.name}
          onChange={handleChange}
        />

        <label className="label mt-[10px]">Description</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Description"
          id="description"
          value={form.description}
          onChange={handleChange}
        />

        <label className="label mt-[10px]">Status</label>
        <select
          id="status"
          value={form.status}
          onChange={handleChange}
          className="select w-full"
        >
          <option disabled value="">
            Select Status
          </option>
          {statusOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="label mt-[10px]">Client</label>
        <select
          id="clientId"
          value={form.clientId}
          onChange={handleChange}
          disabled={loading}
          className="select w-full"
        >
          <option disabled value="">
            Select Client
          </option>
          {clients?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading || submitting}
          className="btn btn-neutral mt-4 flex items-center gap-2"
        >
          {submitting || loading ? <Spinner /> : null}
          <span>Add Project</span>
        </button>
      </fieldset>
    </form>
  );
}
function Modal({
  show,
  onClose,
  children,
}: {
  show: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <div className="card bg-base-100 w-full max-w-[450px] shadow-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%] z-[50]">
      <div className="card-body">
        <ModalHeader onClose={onClose} />
        {children}
      </div>
    </div>
  );
}

// -------- Main Component --------
export default function AddProjectModal() {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    status: "new",
    clientId: "",
  });
  const [toggle, setToggle] = useState(false);

  const [createProject, mCtxAddProject] = useMutation<AddProjectData>(
    ADD_PROJECT,
    {
      variables: { ...form },
      // refetchQueries: [{ query: GET_PROJECTS }],
      update: (cache, { data }) => {
        if (!data?.addProject) return;
        const existing = cache.readQuery<GetProjectsData>({
          query: GET_PROJECTS,
        });
        if (existing) {
          cache.writeQuery<GetProjectsData>({
            query: GET_PROJECTS,
            data: { projects: [...existing.projects, data.addProject] },
          });
        }
      },
    }
  );

  const queryClients = useQuery<GetClientsData>(GET_CLIENTS);

  // Handlers
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setToggle((s) => !s);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value as ProjectForm["status"] }));
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description, status, clientId } = form;
    if (!name || !description || !status || !clientId) {
      return alert("Please fill in all fields");
    }
    createProject();
    setForm({ name: "", description: "", status: "new", clientId: "" });
    setToggle(false);
  };

  // UI
  const statusOptions = [
    { key: "new", label: "Not Started" },
    { key: "progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <>
      <ToggleButton onClick={handleToggle} />
      <Modal show={toggle} onClose={handleToggle}>
        <ProjectFormComponent
          form={form}
          handleChange={handleChange}
          onSubmit={onSubmit}
          statusOptions={statusOptions}
          clients={queryClients.data?.clients}
          loading={queryClients.loading}
          submitting={mCtxAddProject.loading}
        />
      </Modal>
    </>
  );
}
