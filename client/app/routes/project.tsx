import { Link, useParams } from "react-router";
import Spinner from "../components/Spinner";
import ClientInfo from "../components/ClientInfo";
import EditProjectForm from "../components/forms/EditProjectForm";
import DeleteProjectButton from "../components/buttons/DeleteProjectButton";

import { useQuery } from "@apollo/client/react";
import { GET_PROJECT } from "../graphql/queries/projectQueries";

// Define types for Client and Project
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  client: Client;
}

// Define query response shape
interface GetProjectData {
  project: Project;
}

interface GetProjectVars {
  id: string;
}

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<GetProjectData, GetProjectVars>(
    GET_PROJECT,
    { variables: { id: id! } }
  );

  if (loading) return <Spinner />;
  if (error) return <p>Something Went Wrong</p>;
  if (!data) return null;

  return (
    <div className="mx-auto w-75 card p-5">
      <Link to="/" className="btn btn-light btn-sm w-25 d-inline ms-auto">
        Back
      </Link>

      <h1>{data.project.name}</h1>
      <p>{data.project.description}</p>

      <h5 className="mt-3">Project Status</h5>
      <p className="lead">{data.project.status}</p>

      <ClientInfo client={data.project.client} />
      <EditProjectForm project={data.project} />
      <DeleteProjectButton projectId={data.project.id} />
    </div>
  );
}
