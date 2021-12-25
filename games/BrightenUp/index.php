<!DOCTYPE html>
<html>
<head>
    <?php $base = "../../" ?>
    <base href="../../">
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="js/facebox.js"></script>
    <script src="js/gameSettings.js"></script>
    <link rel="stylesheet" type="text/css" href="css/facebox.css"/>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
    <script type="text/javascript">
        jQuery(document).ready(function($) {
            $('a[rel*=facebox]').facebox()
        })
    </script>
</head>
<body>
<div class="container">
    <?php include $base."header.php"; ?>
    <nav>
        <ul>
        <li><a href="">Home</a></li>
<!--            <li><a href="games/empty">Empty Template</a></li>-->
        </ul>
        <?php include $base."leftMenuGame.php"; ?>

    </nav>
    <article>
        <h1 id="gameName">Brighten Up</h1>
        <h3 id="groupName">Coco_11</h3>
        <h3>Instruction:</h3>
        <div class="jumbotron">
            <p> The Brighten Up game is a two person game. In this game, you are given <strong> m </strong> bags each with <strong> n </strong> flares, which can be good or bad. Bags are divided into two groups, and bags in group2 have significantly more bad flares than bags in group1. You can set the number of bags in each group, but you do not know which bags belong to which groups. Each turn, you can perform one of two operations as follows: </p>

            <p> <strong> Test: </strong> The player can test up to 5% of <strong> n </strong> flares from one bag. Then, the number of bad flares will be shown.</p>

            <p> <strong> Select: </strong> The player can select up to 50% of the remaining flares from all bags. Then, his/her score for this selection will be calculated based on the number of good flares and bad flares in the selection. The player can get 100 from each of the good flares, but each of the bad flares will cost -1000.</p>

            <p> <strong> Instructions </strong> 
                <p> - Press pop-up to access game window. </p>
                <p> - When it is your turn, fill in the number you want to test/select under the bag, then click "Test"/"Select" at the bottom. When you do not want to take actions anymore, click "End" to end your operations. </p>
            </p>

            <p> <strong> Note: </strong> For best experience, maximize window as much as possible. </p>
        </div>

        <h3>Play game in pop up window:<h3>
        <form id="gameSettings" class="well"></form>
        <h4>Screenshot:</h4>
        <img src="./games/BrightenUp/BrightenUp.png" width="100%" heigth="100%"></img>
    </article>
    <?php include $base."footer.php"; ?>
</div>
<script type="text/javascript">
    newWindowBtn(1300,900,"./games/BrightenUp/index.html",[]);
</script>
</body>
</html>
