import React from 'react'
import { Button } from './ui/button'
import { category } from '@/types/category';
type categoryTableProps ={
    categories:{id:string,name:string}[];
    openEditDialog:(categor:category)=>void;
    setSelectedCategory:(category:category)=>void;
    setIsOpenDialogForDelete:any


}

const CategoryTable = ({categories,openEditDialog,setIsOpenDialogForDelete,setSelectedCategory}:categoryTableProps) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {category.name}
                </td>
                <td className="px-6 py-4">
                  <Button
                    onClick={() => openEditDialog(category)}
                    className="bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsOpenDialogForDelete(true)
                    }}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}

export default CategoryTable
