"use client";

export default async function home() {
  const handleButtonClick = () => {
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
  }
  return (
    <div onClick={handleButtonClick}>测试显示</div>
  )
}