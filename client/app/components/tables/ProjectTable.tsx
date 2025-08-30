import Spinner from "../Spinner";
import { FaTrash } from "react-icons/fa";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PROJECTS } from "../../graphql/queries/projectQueries";
import { DELETE_PROJECT } from "../../graphql/mutations/projectMutations";

interface Project {
  id: string;
  name: string;
  status: string;
}
interface GetProjectsData {
  projects: Project[];
}
interface ProjectRowProps {
  project: Project;
}
interface TableClientRowProps {
  data: Project[] | undefined;
}

const Table = ({ data }: TableClientRowProps) => {
  const headers = ["name", "status", ""];
  const rows = data || [];

  const THeader = () => {
    return (
      <>
        <thead>
          <tr>
            {headers.map((val, i) => {
              return <th key={i}>{val}</th>;
            })}
          </tr>
        </thead>
      </>
    );
  };
  const TActions = ({ project }: ProjectRowProps) => {
    // const [updateClient, mCtxUpdateProject] = useMutation(DELETE_PROJECT, {
    //   variables: { id: project.id },
    //   refetchQueries: [{ query: GET_PROJECTS }, { query: GET_PROJECTS }],
    // });
    const [deleteProject, mCtxDeleteProject] = useMutation(DELETE_PROJECT, {
      variables: { id: project.id },
      refetchQueries: [{ query: GET_PROJECTS }, { query: GET_PROJECTS }],
    });
    // const { loading } = mCtxUpdateProject
    // const { loading } = mCtxDeleteProject

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      deleteProject();
    };
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      deleteProject();
    };

    return (
      <>
        <div className="w-full flex justify-end gap-[10px]">
          {/* <button
              className="btn btn-danger btn-sm"
              onClick={handleUpdate}
              disabled={mCtxUpdateProject.loading}
            >
              <FaTrash />
            </button> */}
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={mCtxDeleteProject.loading}
          >
            <FaTrash />
          </button>
        </div>
      </>
    );
  };
  const TRow = ({ project }: { project: Project }) => {
    return (
      <>
        <tr>
          <td>{project.name}</td>
          <td>{project.status}</td>
          <td>
            <TActions project={project} />
          </td>
        </tr>
      </>
    );
  };
  const TRows = () => {
    return (
      <>
        {rows.map((project, index) => {
          return <TRow key={index} project={project} />;
        })}
      </>
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <THeader />
          <tbody>
            <TRows />
          </tbody>
        </table>
      </div>
    </>
  );
};

export default function ProjectTable() {
  const queryClients = useQuery<GetProjectsData>(GET_PROJECTS);
  // const { loading, error, data } = queryClients;

  const Loading = () => {
    return (
      <>
        <div className="w-full min-h-[300px] flex justify-center items-center">
          <div className="w-full h-full flex justify-center items-center mt-[-70px]">
            <Spinner />
          </div>
        </div>
      </>
    );
  };
  const Error = () => {
    return (
      <>
        <div className="w-full min-h-[300px] flex justify-center items-center">
          <div className="w-full h-full flex justify-center items-center mt-[-70px] gap-[10px]">
            <span className="font-bold">Something Went Wrong</span>
            <span className="loading loading-dots loading-sm mt-[8px]"></span>{" "}
          </div>
        </div>
      </>
    );
  };

  if (queryClients.loading) return <Loading />;
  if (queryClients.error) return <Error />;

  return (
    <>
      <Table data={queryClients.data?.projects} />
    </>
  );
}
