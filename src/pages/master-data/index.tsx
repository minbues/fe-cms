import { useState } from "react";
import { highlight, languages } from "prismjs";
import ReactJson from "react-json-view";
import Editor from "react-simple-code-editor";

import { Button, Col, Row, Spin } from "antd";

import "prismjs/themes/prism.css";
import PageContent from "../../components/common/PageContent";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getStoreMasterData,
  getStoreMasterDataRecordId,
  updateMasterData,
} from "../../redux/appSlice";
import { getLoading } from "../../redux/appSlice";
import { AppDispatch } from "../../redux/store";

const MetadataManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector(getStoreMasterDataRecordId);
  const masterData = useSelector(getStoreMasterData);
  const isLoading = useSelector(getLoading);

  const [code, setCode] = useState(JSON.stringify(masterData, null, 8));

  const handleSaveMasterData = async () => {
    dispatch(
      updateMasterData({
        id: id,
        data: JSON.parse(code),
      })
    );
  };

  return (
    <>
      {isLoading && <Spin size="large" fullscreen />}
      <PageContent
        title={t("master_data")}
        sx={{ height: "100%" }}
        action={
          <Button
            type="primary"
            onClick={handleSaveMasterData}
            loading={isLoading}
            disabled={isLoading}
          >
            Save Data
          </Button>
        }
      >
        <Row gutter={16} style={{ height: "100%", padding: 16 }}>
          <Col xs={24} md={12}>
            <div
              style={{
                padding: 16,
                height: "100%",
                backgroundColor: "#f8fafc",
              }}
            >
              <Editor
                placeholder="Config your master data here…"
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, languages.js, "js")}
                padding={10}
                className="container__editor"
                tabSize={8}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div
              style={{
                padding: 24,
                height: "100%",
                backgroundColor: "#f8fafc",
              }}
            >
              <ReactJson
                src={masterData}
                name={false}
                style={{
                  padding: 24,
                  height: "100%",
                  backgroundColor: "#f8fafc",
                }}
              />
            </div>
          </Col>
        </Row>
      </PageContent>
    </>
  );
};

export default MetadataManagement;
