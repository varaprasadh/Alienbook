<template>
  <section class="container">
    <PlainHeader title="Privacy Policy"/>
    <div class="content">
			<h1>#Privacy Policy</h1>
      <div class="tldr">
          <blockquote>we are not keeping/tracking any information without your knowledge;</blockquote>
      </div>

      <h3>Your privacy is critically important to us.</h3>
			<p>It is Alienbook's policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to <a href="https://alienbook.web.app">https://alienbook.web.app</a> (hereinafter, "us", "we", or "https://alienbook.web.app"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.</p>
			<p>This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.</p>

			
			<h2>Gathering of Personally-Identifying Information</h2>
			<p>Certain visitors to Alienbook's websites choose to interact with Alienbook in ways that require Alienbook to gather personally-identifying information. The amount and type of information that Alienbook gathers depends on the nature of the interaction. For example, we ask visitors who sign up for a blog at https://alienbook.web.app to provide a username and email address.</p>
	
			<h2>Security</h2>
			<p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
			<h2>Privacy Policy Changes</h2>
			<p>Although most changes are likely to be minor, Alienbook may change its Privacy Policy from time to time, and in Alienbook's sole discretion. Alienbook encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.</p>
			<h2></h2>
      <div class="author-info">
        <address>
          varaprasadh, <br/>
          CEO,Alienbook,<br/>
          looking for normal job!,<br/>
        </address>
      </div>
    </div>
  </section>
</template>

<script>
import PlainHeader from "../components/PlainHeader";
export default {
  name:"privacyPolicy",
  components:{PlainHeader}
}
</script>

<style scoped>
.content{
    max-width: 600px;
    margin: 1em auto;
    background: white;
    box-shadow: 1px 1px 3px rgb(173, 171, 171);
    border-radius: 5px;
    padding: 1em;
    margin: auto;
}
.tldr{
  background: rgb(235, 240, 239);
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background: black;
}
.author-info{
  display: flex;
  justify-content: flex-end;
}
</style>