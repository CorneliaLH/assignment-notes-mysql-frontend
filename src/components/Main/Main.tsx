import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PostsService } from "../../services/PostsService";
import "./main.css";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

interface IPost {
  title: string;
  message: string;
  userId: string;
  id: string;
  created: Date;
  lastchange: Date;
}

interface IUserIdAndId {
  userId: number;
  id: number;
}

interface ITitle {
  title: string;
}

export function Main() {
  const editorRef: any = useRef();
  const [listOfDocuments, setListOfDocuments] = useState<JSX.Element[]>([]);
  const [toggleDocuments, setToggleDocuments] = useState(false);
  const [booleanEditorChangeDocument, setBooleanEditorChangeDocument] =
    useState(false);
  const [valuesForChangeEditor, setValuesForChangeEditor] =
    useState<string>("");
  const [userIdAndId, setUserIdAndId] = useState<IUserIdAndId>({
    userId: 0,
    id: 0,
  });
  const [titleValue, setTitleValue] = useState<ITitle>({ title: "" });
  const [booleanShowDocuments, setBooleanShowDocuments] = useState(false);
  const [createNewDocument, setCreateNewDocument] = useState(false);
  const [userId, setUserId] = useState({ userId: 0 });
  const navigation = useNavigate();

  if (localStorage.getItem("userId") === null || undefined) {
    navigation("/");
  }

  useEffect(() => {
    if (!localStorage.userId) {
      console.log("localStorage is empty");

      return;
    } else {
      let user: string | null = localStorage.getItem("userId");
      let user1 = Number(user);
      let service = new PostsService();
      service.getDocumentsByUser(user1).then((response) => {
        setBooleanShowDocuments(true);
        setUserId({ userId: user1 });
        let list = response.map((post: any, i: number) => {
          return (
            <li
              className='listItemHeading'
              key={i}
              onClick={() => {
                goToPostPage(user1, post.id);
              }}
            >
              {parse(post.title)}
            </li>
          );
        });
        setListOfDocuments(list);
      });
    }
  }, [toggleDocuments]);

  //Funktion för att visa dokumentet

  function goToPostPage(user: number, id: number) {
    let service = new PostsService();
    service.getDocumentsByIdAndTitle(user, id).then((response) => {
      setTitleValue({ title: response[0].title });
      let value = response[0].message;
      setValuesForChangeEditor(value);
      setUserIdAndId({ userId: response[0].userId, id: response[0].id });
      showThePage(response);
    });
  }

  function showThePage(pageToShow: IPost[]) {
    setBooleanShowDocuments(false);
    let page = pageToShow.map((post: any, u: number) => {
      //Gör om datum till sv format
      let dateArrayDone: string[] = [];
      let dateArray: Date[] = [
        new Date(post.created),
        new Date(post.lastchange),
      ];
      for (let i = 0; i < dateArray.length; i++) {
        let dateStringCreated = dateArray[i].toLocaleDateString("en-se");
        let timeStringCreated = dateArray[i].toLocaleTimeString();
        let updatedDateString = `${dateStringCreated} kl. ${timeStringCreated} `;
        dateArrayDone.push(updatedDateString);
      }
      let dateCreated = dateArrayDone[0];
      let dateChanged = dateArrayDone[1];
      return (
        <div key={u} className='containerPageShowDocument'>
          <h2>Dokument: </h2>
          <ul className='listDocument'>
            <li>
              <div className='containerDocument'>
                <div className='listItemHeading'>{parse(post.title)}</div>
                <div>{parse(post.message)}</div>
              </div>
              <p className='showDate'>Skapat: {dateCreated}</p>
              <p className='showDate'>Senast ändrat: {dateChanged}</p>
            </li>
          </ul>
          <button
            onClick={() => {
              changeDocument();
            }}
          >
            Ändra i dokument
          </button>
          <button
            onClick={() => {
              removeDocument(pageToShow[0].id);
            }}
          >
            Ta bort dokument
          </button>
          <button
            onClick={() => {
              if (toggleDocuments === true) {
                setToggleDocuments(false);
              } else {
                setToggleDocuments(true);
              }
            }}
          >
            Tillbaka till alla dokument
          </button>
        </div>
      );
    });
    setListOfDocuments(page);
  }

  function changeDocument() {
    setListOfDocuments([]);
    setBooleanEditorChangeDocument(true);
    return <></>;
  }

  function removeDocument(id: string) {
    let service = new PostsService();
    service.removeDocument(id).then((result) => {
      if (result.result === "ok") {
        setBooleanShowDocuments(true);
        if (toggleDocuments === true) {
          setToggleDocuments(false);
        } else {
          setToggleDocuments(true);
        }
        alert("Dokumentet har tagits bort");
      }
    });
  }

  const saveChange = () => {
    if (editorRef.current) {
      let service = new PostsService();
      service
        .changeDocument(
          userIdAndId.userId,
          userIdAndId.id,
          titleValue.title,
          editorRef.current.getContent().replace(/&#39/g, "&apos")
        )
        .then((result) => {
          console.log(result.result);
          if (result.result === "ok") {
            setBooleanEditorChangeDocument(false);
            alert("Dokument har uppdaterats");
            if (toggleDocuments === true) {
              setToggleDocuments(false);
            } else {
              setToggleDocuments(true);
            }
          } else {
            if (
              result.error === "Du har inte gjort några ändringar, försök igen!"
            ) {
              alert(result.error);
            } else {
              alert("Något gick fel, försök igen!");
            }
          }
        });
    }
  };

  function handleInputChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitleValue({ ...titleValue, [e.target.name]: e.target.value });
  }

  function saveNew() {
    if (editorRef.current) {
      let service = new PostsService();
      service
        .newDocument(
          userId.userId,
          titleValue.title,
          editorRef.current.getContent()
        )
        .then((result) => {
          console.log(result);
          if (result.result === "ok") {
            alert("Du har skapat ett nytt dokument");
            setTitleValue({ title: "" });
            setCreateNewDocument(false);
            if (toggleDocuments === true) {
              setToggleDocuments(false);
            } else {
              setToggleDocuments(true);
            }
          } else {
            alert("Något gick fel, försök igen!");
          }
        });
    }
  }

  return (
    <>
      <button
        onClick={() => {
          localStorage.removeItem("userId");
          navigation("/");
        }}
      >
        Logga ut
      </button>
      <div className='containerCardMain'>
        {booleanShowDocuments ? (
          <>
            <h1>Välkommen till alla dina dokument!</h1>
            <button
              onClick={() => {
                setTitleValue({ title: "" });
                setValuesForChangeEditor("");
                setCreateNewDocument(true);
                setListOfDocuments([]);
                setBooleanShowDocuments(false);
              }}
            >
              Skapa nytt dokument
            </button>
            <h2>Klicka för att se ditt dokument:</h2>
          </>
        ) : (
          ""
        )}
        <ul className='listShowDocument'>{listOfDocuments}</ul>
        {createNewDocument ? (
          <div className='editorOpen'>
            <button
              onClick={() => {
                setCreateNewDocument(false);
                if (toggleDocuments === true) {
                  setToggleDocuments(false);
                } else {
                  setToggleDocuments(true);
                }
              }}
            >
              Tillbaka till dokument
            </button>
            <input
              type='text'
              name='title'
              placeholder='Titel dokument'
              value={titleValue.title}
              onChange={handleInputChangeTitle}
            />
            <Editor
              apiKey='8kxwu6mpexyvg3ru28nca0r01s2fofvnqu67pykgdbgajiig'
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={valuesForChangeEditor}
              init={{
                height: 500,
                menubar: false,
                // plugins: [
                //   "advlist autolink lists link image charmap print preview anchor",
                //   "searchreplace visualblocks code fullscreen",
                //   "insertdatetime media table paste code help wordcount",
                // ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
            <button onClick={saveNew}>Spara ny</button>
          </div>
        ) : (
          ""
        )}
        {booleanEditorChangeDocument ? (
          <div className='editorOpen'>
            <button
              onClick={() => {
                setBooleanEditorChangeDocument(false);
                if (toggleDocuments === true) {
                  setToggleDocuments(false);
                } else {
                  setToggleDocuments(true);
                }
              }}
            >
              Tillbaka till dokument
            </button>
            <input
              type='text'
              name='title'
              placeholder='Titel dokument'
              value={titleValue.title}
              onChange={handleInputChangeTitle}
            />
            <Editor
              apiKey='8kxwu6mpexyvg3ru28nca0r01s2fofvnqu67pykgdbgajiig'
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={valuesForChangeEditor}
              init={{
                height: 500,
                menubar: false,
                // plugins: [
                //   "advlist autolink lists link image charmap print preview anchor",
                //   "searchreplace visualblocks code fullscreen",
                //   "insertdatetime media table paste code help wordcount",
                // ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
            <button onClick={saveChange}>Spara ändring</button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
