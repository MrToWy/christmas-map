import {type ColumnDef} from "@tanstack/react-table";
import type {Route} from "./+types/home";
import {DataTable} from "~/components/data-table/dataTable";
import type {Payment} from "~/types/payment";
import {Button} from "~/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import {Badge} from "~/components/ui/badge";

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "another",
    },
    {
      id: "728ed52f",
      amount: 200,
      status: "pending",
      email: "m@example.com",
    },
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
          <Badge variant="default">Example Badge</Badge>
          <DataTable columns={columns} data={data} />
        </div>
  )
}
