import { useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { Terminal, Share, Users, Circle } from "lucide-react";

function Editor() {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [sessionId, setSessionId] = useState(
    () =>
      window.location.hash.slice(1) ||
      Math.random().toString(36).substring(2, 8)
  );
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(["$ "]);
  const [connectedUsers, setConnectedUsers] = useState(new Set());
  const [showCollaborators, setShowCollaborators] = useState(true);
  const providerRef = useRef(null);

  useEffect(() => {
    window.location.hash = sessionId;
  }, [sessionId]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      sessionId,
      doc
    );
    providerRef.current = provider;

    const type = doc.getText("monaco");
    const binding = new MonacoBinding(
      type,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    provider.awareness.setLocalState({
      user: {
        name: "User " + Math.floor(Math.random() * 100),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      },
    });

    const updateUsers = () => {
      const users = new Set();
      provider.awareness.getStates().forEach((state) => {
        if (state.user) {
          users.add({
            name: state.user.name,
            color: state.user.color,
          });
        }
      });
      setConnectedUsers(users);
    };

    provider.awareness.on("change", updateUsers);
    updateUsers();

    return () => {
      provider.disconnect();
      provider.awareness.off("change", updateUsers);
    };
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${sessionId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Session URL copied to clipboard!");
  };

  const handleNewSession = () => {
    const newSessionId = Math.random().toString(36).substring(2, 8);
    setSessionId(newSessionId);
    window.location.reload();
  };

  const handleTerminalCommand = (e) => {
    if (e.key === "Enter") {
      const command = e.target.value.trim();
      setTerminalOutput((prev) => [
        ...prev,
        `$ ${command}`,
        "Command execution is disabled in this demo",
        "$ ",
      ]);
      e.target.value = "";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 p-2 flex justify-between">
        <div className="flex gap-4">
          <button
            onClick={handleNewSession}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            New Session
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Share
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="px-3 py-1 bg-gray-700 text-white rounded"
          >
            Terminal
          </button>
          <button
            onClick={() => setShowCollaborators(!showCollaborators)}
            className="px-3 py-1 bg-gray-700 text-white rounded"
          >
            Collaborators
          </button>
        </div>
        <div className="flex items-center gap-4 text-white">
          <div>{connectedUsers.size} online</div>
          <div>Session ID: {sessionId}</div>
        </div>
      </div>
      <div className="flex flex-1">
        {showCollaborators && (
          <div className="w-48 bg-gray-900 p-4 text-white">
            <h3>Connected Users</h3>
            {Array.from(connectedUsers).map((user, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: user.color }}
                  className="w-2 h-2 rounded-full"
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${showTerminal ? "h-2/3" : "h-full"}`}>
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              defaultValue="// Start coding here..."
              theme="vs-dark"
              onMount={handleEditorDidMount}
            />
          </div>
          {showTerminal && (
            <div className="h-1/3 bg-black text-white p-4 overflow-auto">
              {terminalOutput.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <input
                type="text"
                className="w-full bg-transparent outline-none"
                onKeyDown={handleTerminalCommand}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;
