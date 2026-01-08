import {type ColumnDef} from "@tanstack/react-table";
import type {Route} from "./+types/home";
import {DataTable} from "~/components/data-table/dataTable";
import type {Payment} from "~/types/payment";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function List() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
  )
}
