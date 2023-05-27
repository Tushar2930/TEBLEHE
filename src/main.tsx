import * as React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

// fetch data from api
const fetchData = async () => {
  const response = await fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json')
  const data = await response.json()
  console.log(data)
  return data
}



import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

type Person = {
  id:number
  name: string
  image: string
  category: string
  label: string
  price: string
  description: string
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.category, {
    id: 'category',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Category</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('price', {
    header: () => 'Price',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('label', {
    header: () => <span>Label</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    footer: info => info.column.id,
  }),
]

function App() {
  const [data, setData] = React.useState([] as Person[])
  const rerender = async () => {
    const data = await fetchData()
    setData(data)
  }


  React.useEffect(() => {
  (async () => {
    const data = await fetchData()
    //data needs to be sorted by name and price columns
    data.sort((a,b) => {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
    data.sort((a,b) => {
      if(a.price < b.price) { return -1; }
      if(a.price > b.price) { return 1; }
      return 0;
    })
    setData(data)
    console.log(data)
  })()
}, [])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
