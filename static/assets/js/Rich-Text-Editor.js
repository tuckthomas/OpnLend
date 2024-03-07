document.addEventListener("DOMContentLoaded", function() {
  const editor = document.getElementById("editor");

  function execCommand(command, value = null) {
    document.execCommand(command, false, value);
  }

  // Font Style
  document.getElementById("fontStyle").addEventListener("change", function() {
    execCommand("fontName", this.value);
  });

  // Font Size
  document.getElementById("fontSize").addEventListener("change", function() {
    execCommand("fontSize", this.value);
  });

  // Font Color
  document.getElementById("fontColor").addEventListener("change", function() {
    execCommand("foreColor", this.value);
  });

  // Bold
  document.getElementById("bold").addEventListener("click", function() {
    execCommand("bold");
  });

  // Italic
  document.getElementById("italic").addEventListener("click", function() {
    execCommand("italic");
  });

  // Underline
  document.getElementById("underline").addEventListener("click", function() {
    execCommand("underline");
  });

  // Left Align
  document.getElementById("leftAlign").addEventListener("click", function() {
    execCommand("justifyLeft");
  });

  // Center Align
  document.getElementById("centerAlign").addEventListener("click", function() {
    execCommand("justifyCenter");
  });

  // Right Align
  document.getElementById("rightAlign").addEventListener("click", function() {
    execCommand("justifyRight");
  });

  // Justify
  document.getElementById("justify").addEventListener("click", function() {
    execCommand("justifyFull");
  });

  // Insert Unordered List
  document.getElementById("unorderedList").addEventListener("click", function() {
    execCommand("insertUnorderedList");
  });

  // Insert Ordered List
  document.getElementById("orderedList").addEventListener("click", function() {
    execCommand("insertOrderedList");
  });

  // Create Link
  document.getElementById("createLink").addEventListener("click", function() {
    const url = prompt("Enter the URL:");
    if (url) {
      execCommand("createLink", url);
    }
  });

  // Insert Image
  document.getElementById("insertImage").addEventListener("click", function() {
    const url = prompt("Enter the image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  });

  // Automatically expand the editor vertically as content overflows
  editor.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Manual vertical resizing using drag
  let startY;
  let startHeight;
  let isResizing = false;

  function onMouseDown(e) {
    startY = e.clientY;
    startHeight = editor.offsetHeight;
    isResizing = true;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    if (isResizing) {
      const deltaY = e.clientY - startY;
      editor.style.height = (startHeight + deltaY) + "px";
    }
  }

  function onMouseUp() {
    isResizing = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  // Event listener for starting resizing
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "resize-handle";
  editor.appendChild(resizeHandle);
  resizeHandle.addEventListener("mousedown", onMouseDown);

  // Prevent text selection while resizing
  resizeHandle.addEventListener("mousedown", function(e) {
    e.preventDefault();
  });

  // Prevent horizontal resizing
  editor.addEventListener("mousemove", function(e) {
    if (isResizing) {
      const mouseX = e.clientX;
      resizeHandle.style.right = `${window.innerWidth - mouseX}px`;
    }
  });

});
