import Spinner from "../Spinner";
import { FaTrash } from "react-icons/fa";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CLIENTS } from "../../graphql/queries/clientQueries";

import { DELETE_CLIENT } from "../../graphql/mutations/clientMutations";
import { GET_PROJECTS } from "../../graphql/queries/projectQueries";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}
interface GetClientsData {
  clients: Client[];
}
interface ClientRowProps {
  client: Client;
}
interface TableClientRowProps {
  data: Client[] | undefined;
}

const Table = ({ data }: TableClientRowProps) => {
  const headers = ["name", "email", "phone", ""];
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
  const TActions = ({ client }: ClientRowProps) => {
    // const [updateClient, mCtxUpdateClient] = useMutation(DELETE_CLIENT, {
    //   variables: { id: client.id },
    //   refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }],
    // });
    const [deleteClient, mCtxDeleteClient] = useMutation(DELETE_CLIENT, {
      variables: { id: client.id },
      refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }],
    });
    // const { loading } = mCtxUpdateClient
    // const { loading } = mCtxDeleteClient

    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      deleteClient();
    };
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      deleteClient();
    };

    return (
      <>
        <div className="w-full flex justify-end gap-[10px]">
          {/* <button
              className="btn btn-danger btn-sm"
              onClick={handleUpdate}
              disabled={mCtxUpdateClient.loading}
            >
              <FaTrash />
            </button> */}
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={mCtxDeleteClient.loading}
          >
            <FaTrash />
          </button>
        </div>
      </>
    );
  };
  const TRow = ({ client }: { client: Client }) => {
    return (
      <>
        <tr>
          <td>{client.name}</td>
          <td>{client.email}</td>
          <td>{client.phone}</td>
          <td>
            <TActions client={client} />
          </td>
        </tr>
      </>
    );
  };
  const TRows = () => {
    return (
      <>
        {rows.map((client, index) => {
          return <TRow key={index} client={client} />;
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

export default function ClientTable() {
  const queryClients = useQuery<GetClientsData>(GET_CLIENTS);
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
      <Table data={queryClients.data?.clients} />
    </>
  );
}
