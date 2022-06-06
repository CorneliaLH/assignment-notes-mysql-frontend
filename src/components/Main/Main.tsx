import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostsService } from "../../services/PostsService";
import "./main.css";
import { Editor } from "@tinymce/tinymce-react";

interface IPost {
  title: string;
  message: string;
  userId: string;
  id: string;
  created: Date;
  lastChange: Date;
}

export function Main() {
  const editorRef: any = useRef();

  const navigation = useNavigate();
  const [changeDocumentWithEditor, setChangeDocumentWithEditor] =
    useState<any>();
  const [renderArray, setRenderArray] = useState<any>([]);
  const [toggleDocument, setToggleDocument] = useState(false);
  const [booleanEditor, setBooleanEditor] = useState(false);
  const [valuesForChange, setValuesForChange] = useState();
  const [userIdAndId, setUserIdAndId] = useState<any>();
  useEffect(() => {
    if (!localStorage.userId) {
      console.log("localStorage is empty");

      return;
    } else {
      let user: string | null = localStorage.getItem("userId");
      let user1 = Number(user);
      let service = new PostsService();
      service.getDocumentsByUser(user1).then((response) => {
        let list = response.map((post: any, i: number) => {
          console.log(post.title);
          return (
            <li
              key={i}
              onClick={() => {
                console.log("Klick funkar");
                goToPostPage(user1, post.id);
              }}
              dangerouslySetInnerHTML={{
                __html: post.title,
              }}
            >
              {}
            </li>
          );
        });
        setRenderArray(list);
        // navigation("/");
      });
    }
  }, [toggleDocument]);

  function goToPostPage(user: number, id: number) {
    console.log(id);
    let service = new PostsService();
    service.getDocumentsByIdAndTitle(user, id).then((response) => {
      console.log(response[0]);
      let value = response[0].title + response[0].message;
      setValuesForChange(value);
      setUserIdAndId({ userId: response[0].userId, id: response[0].id });
      showThePage(response);
    });
  }

  function showThePage(pageToShow: []) {
    let page = pageToShow.map((post: any, i: number) => {
      return (
        <div key={i}>
          <li>
            <div
              dangerouslySetInnerHTML={{
                __html: post.title,
              }}
            ></div>
            <div
              dangerouslySetInnerHTML={{
                __html: post.message,
              }}
            ></div>
            <p>Skapat: {post.created}</p>
            <p>Senast ändrat: {post.lastchange}</p>
          </li>
          ;
          <button
            onClick={() => {
              changeDocument(pageToShow);
            }}
          >
            Ändra i dokument
          </button>
          <button
            onClick={() => {
              if (toggleDocument === true) {
                setToggleDocument(false);
              } else {
                setToggleDocument(true);
              }
            }}
          >
            Tillbaka till alla dokument
          </button>
        </div>
      );
    });
    setRenderArray(page);
  }

  function changeDocument(pageToShow: []) {
    console.log(valuesForChange);
    setRenderArray([]);
    setBooleanEditor(true);
    return <div></div>;
  }

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      let service = new PostsService();
      service
        .changeDocument(
          userIdAndId.userId,
          userIdAndId.id,
          editorRef.current.getContent().replace(/&#39/g, "&apos")
        )
        .then((result) => {
          console.log(result);
        });
    }
  };

  return (
    <>
      <div className='containerPage'>
        <h1>Välkommen till alla dina dokument!</h1>
        <h2>Klicka för att se ditt dokument:</h2>
        <ul>{renderArray}</ul>
        {booleanEditor ? (
          <div className='editorOpen'>
            <Editor
              apiKey='8kxwu6mpexyvg3ru28nca0r01s2fofvnqu67pykgdbgajiig'
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={valuesForChange}
              init={{
                height: 500,
                menubar: false,
                // setup: function (editor) {
                //   editor.on("log", function (ed) {
                //     ed.content = ed.content.replace(/&apos/g, "&#39");
                //   });
                // },
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
            <button onClick={log}>Log editor content</button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
