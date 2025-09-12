import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Form, Input, Button, Spin, Flex } from "antd";
import PageContent from "../../components/common/PageContent";
import { useDispatch, useSelector } from "react-redux";
import {
  getNew,
  isLoadingSelector,
  newSelector,
  updateNew,
} from "../../redux/newSlice";
import { AppDispatch } from "../../redux/store";

const NewsManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const newRedux = useSelector(newSelector);
  const [title, setTitle] = useState(newRedux.title);
  const [content, setContent] = useState(newRedux.content);
  const isLoading = useSelector(isLoadingSelector);
  const reactQuillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    dispatch(getNew());
  }, []);

  useEffect(() => {
    setTitle(newRedux.title);
    setContent(newRedux.content);
  }, [newRedux]);

  const handleSubmit = () => {
    const newsData = {
      title,
      content,
    };
    dispatch(updateNew(newsData));
  };

  return (
    <>
      <PageContent title="Tin tức">
        {isLoading && <Spin size="large" fullscreen />}

        <>
          <Form layout="vertical" style={{ marginBottom: 30 }}>
            <Form.Item
              label="Tiêu đề"
              required
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết"
              />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              required
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <div>
                <ReactQuill
                  ref={reactQuillRef}
                  theme="snow"
                  placeholder="Nhập nội dung bài viết..."
                  style={{
                    height: "50vh",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                  modules={{
                    toolbar: {
                      container: [
                        [{ font: [] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        [{ size: ["small", false, "large", "huge"] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ script: "sub" }, { script: "super" }],
                        ["blockquote", "code-block"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ direction: "rtl" }],
                        [{ align: [] }],
                        ["link", "image", "video", "formula"],
                        ["clean"],
                      ],
                    },
                    clipboard: {
                      matchVisual: false,
                    },
                  }}
                  formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                    "code-block",
                    "align",
                    "color",
                    "background",
                  ]}
                  value={content}
                  onChange={setContent}
                />
              </div>
            </Form.Item>
          </Form>
        </>
      </PageContent>
      <PageContent bodySX={{ padding: "8px" }}>
        <Flex justify="end">
          <Button type="primary" onClick={handleSubmit}>
            Đăng bài
          </Button>
        </Flex>
      </PageContent>
    </>
  );
};

export default NewsManagement;
