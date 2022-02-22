import Link from "next/link"
import Layout from "../components/Layout"
import { FaPlus } from "react-icons/fa"

const IndexPage = () => (
  <Layout title="Crossy bot">
    <div className="min-h-screen App dark:bg-stone-800 dark:text-slate-50">
      <main className="text-lg">
        <nav className="flex items-center h-16">
          <h1 className="m-4 font-serif text-2xl">Crossy</h1>
        </nav>
        <div className="flex flex-col items-center justify-center w-screen py-4 min-h-[calc(100vh-4rem)] bg-opacity-30 dark:bg-opacity-30 dark:bg-stone-700 bg-stone-200">
          <div className="flex p-4">
            <div className="relative flex flex-col items-start bottom-10">
              <h2 className="max-w-xl font-serif text-5xl font-normal sm:text-6xl text-shadow">
                Solve crosswords collaboratively.
              </h2>
              <div className="flex gap-4">
                <a
                  href="/#"
                  className="flex  items-center gap-2 p-3 px-5 ml-0 font-semibold transition shadow-lg hasHover:hover:shadow-xl duration-200 bg-[#5865F2] hasHover:hover:brightness-105 rounded-xl my-6 text-slate-50"
                >
                  <span className="relative top-[1px]">
                    <FaPlus />
                  </span>
                  Invite Crossy
                </a>
                <a
                  href="/#"
                  className="p-3 px-5 my-6 ml-0 font-normal transition duration-200 bg-opacity-0 border shadow-md bg-slate-600 hasHover:hover:bg-opacity-10 rounded-xl text-slate-50 border-opacity-30 border-slate-100"
                >
                  Read the docs
                </a>
              </div>
              <p></p>
              <div className="flex flex-wrap gap-2 -ml-3 text-sm text-sky-800 dark:text-sky-300">
                <a
                  className="p-1 px-4 transition opacity-70 hasHover:hover:opacity-100"
                  href="https://github.com/eamonma/crossy-api"
                >
                  API source
                </a>
                <a
                  className="p-1 px-4 transition opacity-70 hasHover:hover:opacity-100"
                  href="https://github.com/eamonma/crossy-bot"
                >
                  Bot source
                </a>
                <a
                  className="p-1 px-4 transition opacity-70 hasHover:hover:opacity-100"
                  href="https://github.com/eamonma/crossy-grid"
                >
                  Grid renderer source
                </a>
              </div>
            </div>

            {/* <div>image of crossword</div> */}
          </div>
        </div>
      </main>
    </div>
  </Layout>
)

export default IndexPage
