'use client';

import { useOrigin } from '@/hooks/use-origin';
import { useParams } from 'next/navigation';
import { ApiAlert } from './api-alert';

type Props = {
  entityName: string;
  entityIdName: string;
};

export function ApiList({ entityIdName, entityName }: Props) {
  const params = useParams<{ storeId: string }>();
  const origin = useOrigin();

  const baseURL = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseURL}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseURL}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
}
