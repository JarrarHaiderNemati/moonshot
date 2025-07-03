import URLS from "./URLS.js";
import StatusCodes from "./StatusCodes.js";
import axios from "https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('status-msg');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  function setMsg(msg, color, addTimeout = 'yes') {
    statusMsg.innerHTML = msg;
    statusMsg.style.color = color;
    statusMsg.style.fontSize = '20px';
    statusMsg.style.fontWeight = 'bold';

    if (addTimeout !== 'no') {

      setTimeout(() => {
        statusMsg.innerHTML = '';
      }, 1500);
    }
  }

  function RegexTester(type, value) {
    if (type === 'email') {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value);
    }
  }

  async function sendMsg(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    if (!name || !email || !feedback) {
      setMsg('Please fill out all fields!', 'orange');
      return;
    }

    if (!RegexTester('email', email)) {
      setMsg('Wrong email format!', 'orange');
      return;
    }
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.classList.add('disabled-style');
    setMsg('Sending...', 'white', 'no');
    try {
      const reqs = await axios.post(
        URLS.CONTACT,
        { name, email, feedback },
        { validateStatus: () => true }
      );
      const data = reqs.data;
      if (data.status === StatusCodes.SUCCESS) {
        setMsg('Thank you for contacting us!', 'yellow');
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('feedback').value = '';
        btn.disabled = false;
        btn.classList.remove('disabled-style');
      } else {
        btn.disabled = false;
        btn.classList.remove('disabled-style');
        setMsg('Some error occurred!', 'orange');
      }
    } catch (err) {
      btn.disabled = false;
      btn.classList.remove('disabled-style');
      setMsg('Some error occurred!', 'orange');
    }
  }
  form.addEventListener("submit", sendMsg);
});



