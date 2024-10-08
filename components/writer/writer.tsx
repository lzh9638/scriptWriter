"use client";
import { useCompletion } from "ai/react";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import styles from "./Writer.module.css";

const Writer = ({ locale, lang }: any) => {
  // 使用useState初始化选中项的值
  const [selectedOption, setSelectedOption] = useState(locale.options[0]);
  const [streamContent, setStreamContent] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const contentRef: any = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // 初始化textarea的值，这里设为空字符串
  const [textareaValue, setTextareaValue] = useState("");

  const {
    completion,
    complete, // 添加 complete 函数
    isLoading,
    setInput,
  } = useCompletion({
    api: "/api/test",
    onFinish: () => {
      setIsButtonDisabled(false);
    },
  });

  // 处理select变化的函数
  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  // 按钮点击时的处理函数，打印选中的value
  const handleButtonClick = async () => {
    if (!textareaValue) {
      alert("主题不能为空!");
      return;
    }
    if (!selectedOption) {
      alert("风格不能为空!");
      return;
    }
    setIsButtonDisabled(true);
    setDisplayedContent("");
    setStreamContent("");
    setShowContent(false);
    const inputData = JSON.stringify({
      textareaValue,
      selectedOption,
      lang: setLanguage(),
    });

    setInput(inputData);

    try {
      await complete(inputData);
    } catch (error) {
      console.error("Error during completion:", error);
      setIsButtonDisabled(false);
    }
  };
  // 返回语言
  const setLanguage = () => {
    let defaultLang = "zh"; // 默认中文
    let langIndex = 0;

    if (lang && lang.length > 0) {
      langIndex = 0;
    } else {
      lang = [defaultLang]; // 如果 lang 不存在或为空，则设置为默认值
    }
    return lang[langIndex];
  };

  const featAPi = async (e: any) => {};

  // 处理textarea内容变化的函数
  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
  };

  useEffect(() => {
    if (showContent) {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index <= streamContent.length) {
          setDisplayedContent((prev) => getSafeSubstring(streamContent, index));
          index++;
        } else {
          clearInterval(intervalId);
          setShowContent(false);
          setIsButtonDisabled(false);
        }
      }, 30); // 每100ms显示一个字符
      return () => clearInterval(intervalId);
    }
  }, [showContent, streamContent]);

  const getSafeSubstring = (str: any, endIndex: any) => {
    let openTagCount = 0;
    let closeTagCount = 0;

    for (let i = 0; i < endIndex; i++) {
      if (str[i] === "<") {
        openTagCount++;
      } else if (str[i] === ">") {
        closeTagCount++;
      }
    }

    // Ensure we do not end in the middle of a tag
    if (openTagCount > closeTagCount) {
      endIndex = str.indexOf(">", endIndex) + 1;
    }

    return str.slice(0, endIndex);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [completion]);

  return (
    <div className={styles.wrapper}>
      {/* 左侧 */}
      <div className={styles.left}>
        {/* 选项一 */}
        <div className={styles.item}>
          <div className={styles.label}>{locale.theme}</div>
          <textarea
            value={textareaValue}
            onChange={handleTextareaChange}
            className={`${styles.textareaBox} textarea textarea-bordered`}
            placeholder="Please enter your theme script"
          ></textarea>
        </div>
        {/* 选项二 */}
        <div className={`${styles.item} ${styles.twoItem}`}>
          <div className={styles.label}>{locale.style}</div>
          <label className={`${styles.selectBox} form-control`}>
            <select
              className="select select-bordered"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              {locale.options.map((option: any, index: any) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* 提交按钮 */}
        <div className={styles.submit}>
          <button
            className={`${styles.buttonBox} btn btn-outline`}
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled && (
              <span className="loading loading-spinner"></span>
            )}
            {isButtonDisabled ? "Loading..." : locale.generate}
          </button>
        </div>
      </div>
      {/* 右侧 */}
      <div className={styles.right}>
        <div
          ref={contentRef}
          className={`${styles.textareaBox} textarea textarea-bordered`}
          dangerouslySetInnerHTML={{ __html: marked(completion) }}
        />
      </div>
    </div>
  );
};

export default Writer;
