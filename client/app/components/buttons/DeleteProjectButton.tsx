import { useNavigate } from 'react-router';
import { FaTrash } from 'react-icons/fa';

import { useMutation } from '@apollo/client/react';
import { DELETE_PROJECT } from '../../graphql/mutations/projectMutations';
import { GET_PROJECTS } from '../../graphql/queries/projectQueries';

interface DeleteProjectButtonProps {
  projectId: string;
}

export default function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const navigate = useNavigate();

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    variables: { id: projectId },
    onCompleted: () => navigate('/'),
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  return (
    <div className="d-flex mt-5 ms-auto">
      <button className="btn btn-danger m-2" onClick={() => deleteProject()}>
        <FaTrash className="icon" /> Delete Project
      </button>
    </div>
  );
}
