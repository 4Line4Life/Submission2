const UNCOMPLETED_LIST_BOOKS_ID = "books";
const COMPLETED_LIST_BOOKS_ID = "completed-books";
const BOOKS_ITEMID = "itemId";

function makeBook(title, author, year, isCompleted){
    const textTitle = document.createElement("h2");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;

    const textYear = document.createElement("p");
    textYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if(isCompleted){
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createCheckButton()
        );
    }

    return container;
}

function createUndoButton(){
    return createUndoButton("undo-button", function(event){
        undoBooksFromCompleted(event.target.parentElement);
    });
}

function createTrashButton(){
    return createButton("trash-button", function(event){
        removeBooksFromCompleted(event.target.parentElement);
    });
}

function createCheckButton(){
    return createButton("check-button", function(event){
        addBooksToComplete(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event){
        eventListener(event);
    });
    return button;
}

function addBooks(){
    const uncompletedBooksList = document.getElementById(UNCOMPLETED_LIST_BOOKS_ID);
    const completedBooksList = document.getElementById(COMPLETED_LIST_BOOKS_ID);
    const textBook = document.getElementById("title").value;
    const textAuthor = document.getElementById("author").value;
    const textYear = document.getElementById("year").value;
    const checkBoxComplete = document.getElementById("isComplete").checked;
    
    const book = makeBook(textBook,textAuthor,textYear, checkBoxComplete);
    const bookObject = composeBooksObject(textBook,textAuthor,textYear, checkBoxComplete);

    book[BOOKS_ITEMID] = bookObject.id;
    books.push(bookObject);
    if(checkBoxComplete){
        completedBooksList.append(book);
    } else {
        uncompletedBooksList.append(book);
    }

    
    updateDataToStorage();

}

function addBooksToComplete(booksElement){
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOKS_ID);
    const booksTitle = booksElement.querySelector(".inner > h2").innerText;
    const booksAuthor = booksElement.querySelector(".inner > p").innerText;
    const booksYear = booksElement.querySelector(".inner > p").innerText;

    const newBook = makeBook(booksTitle,booksAuthor,booksYear,true);
    const book = findBook(booksElement[BOOKS_ITEMID]);
    book.isCompleted = true;
    newBook[BOOKS_ITEMID] = book.id;

    listCompleted.append(newBook);
    booksElement.remove();

    updateDataToStorage();
}

function removeBooksFromCompleted(booksElement){
    const bookPosition = findBookIndex(booksElement[BOOKS_ITEMID]);
    books.splice(bookPosition,1);

    booksElement.remove();
    updateDataToStorage();
}

function undoBooksFromCompleted(booksElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKS_ID);
    const booksTitle = booksElement.querySelector(".inner > h2").innerText;
    const booksAuthor = booksElement.querySelector(".inner > p").innerText;
    const booksYear = booksElement.querySelector(".inner > p").innerText;

    const newBook = makeBook(booksTitle, booksAuthor, booksYear, false);

    const book = findBook(booksElement[BOOKS_ITEMID]);
    book.isCompleted = false;
    newBook[BOOKS_ITEMID] = book.id;

    listUncompleted.append(newBook);
    booksElement.remove();

    updateDataToStorage();
}