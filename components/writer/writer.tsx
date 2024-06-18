"use client";
import { useState } from "react";
import styles from "./Writer.module.css";

const Writer = ({ locale }: any) => {
  // 使用useState初始化选中项的值
  const [selectedOption, setSelectedOption] = useState(locale.options[0]);

  // 初始化textarea的值，这里设为空字符串
  const [textareaValue, setTextareaValue] = useState("");

  // 处理select变化的函数
  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  // 按钮点击时的处理函数，打印选中的value
  const handleButtonClick = () => {
    console.log("Selected value:", { textareaValue, selectedOption });
  };

  // 处理textarea内容变化的函数
  const handleTextareaChange = (event: any) => {
    setTextareaValue(event.target.value);
  };
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
        <textarea className={`${styles.textareaBox} textarea textarea-bordered`}  placeholder="Your script will appear here."></textarea>
      </div>
    </div>
  );
};

export default Writer;
