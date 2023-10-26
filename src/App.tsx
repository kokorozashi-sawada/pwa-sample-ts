import React, { useEffect, useState } from "react";
import Dexie, { Table } from "dexie";
import "./App.css";

// データベースのテーブル構造を定義
class MyDatabase extends Dexie {
  items: Table<{ value: string; id?: number }, number>;

  constructor() {
    super("Alpha");
    this.version(1).stores({ items: "++id,value" });
    this.items = this.table("items");
  }
}

// Dexieデータベースの設定
const db = new MyDatabase();

function App() {
  const [dataList, setDataList] = useState<{ value: string; id?: number }[]>(
    []
  );
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // データの保存
  const saveData = async () => {
    if (name && email) {
      await db.items.add({
        value: JSON.stringify({
          name: name,
          email: email,
        }),
      });
      fetchData();
    }
  };

  // データの参照
  const fetchData = async () => {
    const value = await db.items.toArray();
    setDataList(value);
  };

  // データの削除
  const deleteData = async (id?: number) => {
    id && (await db.items.delete(id));
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            登録フォーム
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mb-10">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  名前
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                メールアドレス
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mb-10">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={saveData}
            >
              登録
            </button>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {dataList.map((data) => {
          // JSONデータをパース
          const parsedData = JSON.parse(data.value);

          return (
            <li key={data.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div>{data.id}</div>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {parsedData.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {parsedData.email}
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => deleteData(data.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
