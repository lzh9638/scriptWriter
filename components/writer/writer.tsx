"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Writer.module.css";

const Writer = ({ locale, lang }: any) => {
  // 使用useState初始化选中项的值
  const [selectedOption, setSelectedOption] = useState(locale.options[0]);
  const [streamContent, setStreamContent] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const contentRef: any = useRef(null);

  // 初始化textarea的值，这里设为空字符串
  const [textareaValue, setTextareaValue] = useState("");

  // 处理select变化的函数
  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  // 按钮点击时的处理函数，打印选中的value
  const handleButtonClick = () => {
    console.log("Selected value:", { textareaValue, selectedOption });
    const langType: any =  lang && lang[0]
    fetch(`/api/chatgpt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [{ role: "user", content: 'hello' }] }),
    })
    .then( res => {
      console.log( { res });
      
    })
    // .then((res) => res.json())
    //   .then((data) => {
    //     console.log( data );
        
    //     if (data.body?.message?.content) {
    //       const markdownContent = data.body.message.content;
    //       const htmlContent: any = marked(markdownContent);
    //       setStreamContent(htmlContent);
    //       setShowContent(true);
    //     }
    //   });
  };

  // 处理textarea内容变化的函数
  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
  };

  useEffect(() => {
    if (showContent) {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index <= streamContent.length) {
          setDisplayedContent((prev) => streamContent.slice(0, index));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 30); // 每100ms显示一个字符
      return () => clearInterval(intervalId);
    }
  }, [showContent, streamContent]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedContent]);

  return (
    <div className={styles.wrapper}>
      {/* 左侧 */}
      <div className={styles.left}>
        {/* 选项一 */}
        <div className={styles.item}>
          <div className={styles.label}>Topic Script</div>
          <textarea
            value={textareaValue}
            onChange={handleTextareaChange}
            className={`${styles.textareaBox} textarea textarea-bordered`}
            placeholder="Please enter your theme script"
          ></textarea>
        </div>
        {/* 选项二 */}
        <div className={`${styles.item} ${styles.twoItem}`} >
          <div className={styles.label}>Select your vibe</div>
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
          >
            Create script
          </button>
        </div>
      </div>
      {/* 右侧 */}
      <div className={styles.right}>
        {/* <textarea className={`${styles.textareaBox} textarea textarea-bordered`}  placeholder="Your script will appear here."></textarea> */}
         <div ref={contentRef} className={`${styles.textareaBox} textarea textarea-bordered`} dangerouslySetInnerHTML={{ __html: displayedContent }} />
      </div>
    </div>
  );
};

export default Writer;
