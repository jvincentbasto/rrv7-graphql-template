import type { Route } from "./+types/home";

import Wrapper from "~/components/layouts/Wrapper";
import ClientTable from "../components/tables/ClientTable";
import ProjectTable from "../components/tables/ProjectTable";
import AddClientModal from "../components/modals/AddClientModal";
import AddProjectModal from "../components/modals/AddProjectModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RRV7 Graphql" },
    { name: "description", content: "Welcome to React Router V7 and Graphql" },
  ];
}

export default function Home() {
  return (
    <Wrapper>
      <div className="mt-[30px]">
        <div className="flex gap-[10px] justify-end">
          <AddClientModal />
          <AddProjectModal />
        </div>
        <div className="mt-[60px]">
          <ClientTable />
          <hr className="my-[40px] border-black/25 mx-[20px]" />
          <ProjectTable />
        </div>
      </div>
    </Wrapper>
  );
}
