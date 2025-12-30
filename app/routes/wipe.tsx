import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { usePuterStore } from "~/lib/puter"

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, kv } = usePuterStore()
    const navigate = useNavigate()

    const [files, setFiles] = useState<FSItem[]>([])
    const [wiping, setWiping] = useState(false)
    const [confirm, setConfirm] = useState(false)

    /* -------------------- Load Files -------------------- */

    const loadFiles = async () => {
        try {
            const list = (await fs.readDir("./")) as FSItem[]
            setFiles(list)
        } catch {
            // silent fail; filesystem may be empty
        }
    }

    useEffect(() => {
        loadFiles()
    }, [])

    /* -------------------- Auth Guard -------------------- */

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe")
        }
    }, [isLoading, auth.isAuthenticated, navigate])

    /* -------------------- Wipe Logic -------------------- */

    const handleDelete = async () => {
        if (!confirm) return

        setWiping(true)
        clearError?.()

        try {
            await Promise.all(files.map((file) => fs.delete(file.path)))
            await kv.flush()
            setFiles([])
            setConfirm(false)
        } finally {
            setWiping(false)
        }
    }

    /* -------------------- States -------------------- */

    if (isLoading) {
        return <div className="p-6">Loading…</div>
    }

    if (error) {
        return (
            <div className="p-6 text-red-600">
                Error: {error}
            </div>
        )
    }

    /* -------------------- UI -------------------- */

    return (
        <div className="max-w-xl mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">App Data Manager</h1>

            <p className="text-sm text-gray-600">
                Signed in as <span className="font-medium">{auth.user?.username}</span>
            </p>

            {/* File List */}
            <div className="rounded-xl border border-gray-200 p-4">
                <h2 className="mb-3 text-lg font-semibold">Stored Files</h2>

                {files.length === 0 ? (
                    <p className="text-sm text-gray-500">No files found.</p>
                ) : (
                    <ul className="space-y-2 text-sm">
                        {files.map((file) => (
                            <li
                                key={file.id}
                                className="flex justify-between rounded-md bg-gray-50 px-3 py-2"
                            >
                                <span>{file.name}</span>
                                <span className="text-gray-400">{file.size ?? ""}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-4">
                <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>

                <p className="text-sm text-red-600">
                    This action permanently deletes all stored files and key-value data.
                    This cannot be undone.
                </p>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={confirm}
                        onChange={(e) => setConfirm(e.target.checked)}
                    />
                    I understand this will permanently delete my data
                </label>

                <button
                    disabled={!confirm || wiping}
                    onClick={handleDelete}
                    className={`
            w-full rounded-md px-4 py-2 text-sm font-medium text-white
            ${confirm && !wiping ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"}
          `}
                >
                    {wiping ? "Wiping Data…" : "Wipe App Data"}
                </button>
            </div>
        </div>
    )
}

export default WipeApp
