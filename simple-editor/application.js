$(function(){

    var fileEntry = null;

    $('#select-file').on('click' ,function(){
        chrome.fileSystem.chooseEntry({
            type : 'openFile'
        }, function(entry){
            fileEntry = entry;

            entry.file(function(file){
                var reader = new FileReader();

                reader.onerror = function(e){
                    console.error("Read failed...");
                };
                reader.onloadend = function(e){
                    console.log(e);
                    $("#text").val(e.target.result);
                };

                reader.readAsText(file);
                
            })


            chrome.fileSystem.getDisplayPath(entry, function(displayPath){
                $('#filepath').text(displayPath);
            });
        });
    });

    $('#submit').on('click', function(){
        var text = $("#text").val();
        if(fileEntry == null)return;

        chrome.fileSystem.getWritableEntry(fileEntry, function(writableFileEntry) {
            writableFileEntry.createWriter(function(fwriter){
                fwriter.onwriteend = function(e){
                    console.log("Ok Writed");
                };
                fwriter.onerror = function(e){
                    console.error("Write failed...")
                };
                fwriter.write(new Blob([decodeURIComponent(text)], {type: 'text/plain'}));
            }, function(e){
                console.error("Write failed...")
            });
        });
    });

  
});
