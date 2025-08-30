import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { GET_PROJECT } from "../../graphql/queries/projectQueries";
import { UPDATE_PROJECT } from "../../graphql/mutations/projectMutations";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
}
interface EditProjectFormProps {
  project: Project;
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    status: project.status || "Not Started"
  });

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: { id: project.id, ...formData },
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.status) {
      return alert("Please fill out all fields");
    }

    updateProject();
  };

  return (
    <div className="mt-5">
      <h3>Update Project Details</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={formData.name}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={formData.description}
            onChange={onChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            id="status"
            className="form-select"
            value={formData.status}
            onChange={onChange}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
