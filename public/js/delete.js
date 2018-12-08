$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        target=$('e.target')
        const id=target.attr('.data-id');
        console.log(id)
        $.ajax({
            type:'DELETE',
            url:'/article/'+id,
            success: function(response){
                alert('deleting successful');
                window.location.href ='/';
            },
            error: function(error){
                if (error) {
                    console.log(error)
                };
            }
        });
    });
})